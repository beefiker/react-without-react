const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      try {
        return tag(props);
      } catch ({ promise, key }) {
        promise.then((data) => {
          promiseCache.set(key, data);
          rerender();
        });
        return {
          tag: "div",
          props: {
            className: "loader-container",
            children: [
              {
                tag: "div",
                props: {
                  className: "loader",
                  children: [
                    {
                      tag: "div",
                      props: {
                        className: "loader-inner",
                        children: [],
                      },
                    },
                  ],
                },
              },
              {
                tag: "h1",
                props: {
                  className: "loader-text",
                  children: ["Loading Pokemon"],
                },
              },
            ],
          },
        };
      }
    }
    const element = { tag, props: { ...props, children } };
    return element;
  },
};

const store = [];
let storeCursor = 0;

const useState = (initialState) => {
  const _closureCursor = storeCursor;
  store[_closureCursor] = store[_closureCursor] || initialState;

  const setState = (newState) => {
    store[_closureCursor] = newState;
    rerender();
  };

  storeCursor++;
  return [store[_closureCursor], setState];
};

const promiseCache = new Map();
const createResource = (cb, key) => {
  // console.log(cb, key);
  if (promiseCache.has(key)) return promiseCache.get(key);

  throw { promise: cb(), key };
};

const App = () => {
  const [value, setValue] = useState(25);
  const [history, setHistory] = useState([]);

  const getPokemon = createResource(
    () =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${value}`)
        .then((res) => res.json())
        .then((res) => {
          const pokemon = {
            sprite: res.sprites.front_default,
            name: res.name,
            id: res.id,
          };
          setHistory([
            ...history.filter((poke) => poke.name !== pokemon.name),
            pokemon,
          ]);
          return pokemon;
        })
        .catch((err) => console.log(`Pokemon not found`)),
    `pokemon-${value}`
  );

  const getLogo = createResource(
    () =>
      fetch(`https://pokeapi.co/api/v2/item/1`)
        .then((res) => res.json())
        .then((data) => data.sprites.default)
        .catch((err) => console.log(err)),
    "logo"
  );

  return (
    <div className="react-from-scratch-pokemon-finder">
      <header>
        <img className="logo" src={getLogo} alt="item" />
        <h2>Poké Finder</h2>
      </header>
      <main>
        <div className="content">
          {getPokemon ? (
            <div>
              <img className="poke-img" src={getPokemon.sprite} alt="pokemon" />
              <p className="poke-name">- {getPokemon.name} -</p>
            </div>
          ) : (
            <div className="not-found">
              <h1>😢😢😢</h1>
              <h1>Pokemon not found</h1>
            </div>
          )}
          <input
            className="poke-input"
            type="text"
            value={value}
            onchange={(e) => setValue(e.target.value)}
            placeholder="Enter Pokémon name Or Number"
          />
        </div>
        <div className="poke-history">
          {history?.map((item) => (
            <div
              className="history-item"
              onclick={(e) => setValue(e.target.id)}
            >
              <img
                id={item.id}
                className="history-img"
                src={item.sprite}
                alt="pokemon"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const render = (element, container) => {
  if (["string", "number"].includes(typeof element)) {
    container.appendChild(document.createTextNode(String(element)));
    return;
  }

  if (Array.isArray(element)) {
    element.forEach((el) => render(el, container));
    return;
  }

  const actualDomElement = document.createElement(element?.tag);
  // console.log(`actualDomElement`, actualDomElement);
  if (element?.props) {
    const keys = Object.keys(element.props);
    const filteredKeys = keys.filter((key) => key !== "children");
    filteredKeys.forEach((key) => {
      // console.log(`actualDomElement[key]`, actualDomElement[key]);
      // console.log(`element.props[key]`, element.props[key]);
      return (actualDomElement[key] = element.props[key]);
    });
  }
  if (element?.props?.children) {
    element.props.children.forEach((child) => {
      render(child, actualDomElement);
    });
  }

  container.appendChild(actualDomElement);
};

const rerender = () => {
  storeCursor = 0;
  document.getElementById("root").firstChild?.remove();
  render(<App />, document.getElementById("root"));
  (
    document.getElementsByClassName("poke-input")[0] as HTMLInputElement
  )?.focus();
};

render(<App />, document.getElementById("root"));
