const React = {
    createElement: (tag, props, ...children)=>{
        if (typeof tag === "function") try {
            return tag(props);
        } catch ({ promise , key  }) {
            promise.then((data)=>{
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
                                            children: []
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            tag: "h1",
                            props: {
                                className: "loader-text",
                                children: [
                                    "Loading Pokemon"
                                ]
                            }
                        }
                    ]
                }
            };
        }
        const element = {
            tag,
            props: {
                ...props,
                children
            }
        };
        return element;
    }
};
const store = [];
let storeCursor = 0;
const useState = (initialState)=>{
    const _closureCursor = storeCursor;
    store[_closureCursor] = store[_closureCursor] || initialState;
    const setState = (newState)=>{
        store[_closureCursor] = newState;
        rerender();
    };
    storeCursor++;
    return [
        store[_closureCursor],
        setState
    ];
};
const promiseCache = new Map();
const createResource = (cb, key)=>{
    // console.log(cb, key);
    if (promiseCache.has(key)) return promiseCache.get(key);
    throw {
        promise: cb(),
        key
    };
};
const App = ()=>{
    const [value, setValue] = useState(25);
    const [history, setHistory] = useState([]);
    const getPokemon = createResource(()=>fetch(`https://pokeapi.co/api/v2/pokemon/${value}`).then((res)=>res.json()).then((res)=>{
            const pokemon = {
                sprite: res.sprites.front_default,
                name: res.name,
                id: res.id
            };
            setHistory([
                ...history.filter((poke)=>poke.name !== pokemon.name),
                pokemon
            ]);
            return pokemon;
        }).catch((err)=>console.log(`Pokemon not found`)), `pokemon-${value}`);
    const getLogo = createResource(()=>fetch(`https://pokeapi.co/api/v2/item/1`).then((res)=>res.json()).then((data)=>data.sprites.default).catch((err)=>console.log(err)), "logo");
    return /*#__PURE__*/ React.createElement("div", {
        className: "react-from-scratch-pokemon-finder",
        __source: {
            fileName: "index.tsx",
            lineNumber: 106,
            columnNumber: 5
        },
        __self: this
    }, /*#__PURE__*/ React.createElement("header", {
        __source: {
            fileName: "index.tsx",
            lineNumber: 107,
            columnNumber: 7
        },
        __self: this
    }, /*#__PURE__*/ React.createElement("img", {
        className: "logo",
        src: getLogo,
        alt: "item",
        __source: {
            fileName: "index.tsx",
            lineNumber: 108,
            columnNumber: 9
        },
        __self: this
    }), /*#__PURE__*/ React.createElement("h2", {
        __source: {
            fileName: "index.tsx",
            lineNumber: 109,
            columnNumber: 9
        },
        __self: this
    }, "Pok\xe9 Finder")), /*#__PURE__*/ React.createElement("main", {
        __source: {
            fileName: "index.tsx",
            lineNumber: 111,
            columnNumber: 7
        },
        __self: this
    }, /*#__PURE__*/ React.createElement("div", {
        className: "content",
        __source: {
            fileName: "index.tsx",
            lineNumber: 112,
            columnNumber: 9
        },
        __self: this
    }, getPokemon ? /*#__PURE__*/ React.createElement("div", {
        __source: {
            fileName: "index.tsx",
            lineNumber: 114,
            columnNumber: 13
        },
        __self: this
    }, /*#__PURE__*/ React.createElement("img", {
        className: "poke-img",
        src: getPokemon.sprite,
        alt: "pokemon",
        __source: {
            fileName: "index.tsx",
            lineNumber: 115,
            columnNumber: 15
        },
        __self: this
    }), /*#__PURE__*/ React.createElement("p", {
        className: "poke-name",
        __source: {
            fileName: "index.tsx",
            lineNumber: 116,
            columnNumber: 15
        },
        __self: this
    }, "- ", getPokemon.name, " -")) : /*#__PURE__*/ React.createElement("div", {
        className: "not-found",
        __source: {
            fileName: "index.tsx",
            lineNumber: 119,
            columnNumber: 13
        },
        __self: this
    }, /*#__PURE__*/ React.createElement("h1", {
        __source: {
            fileName: "index.tsx",
            lineNumber: 120,
            columnNumber: 15
        },
        __self: this
    }, "\uD83D\uDE22\uD83D\uDE22\uD83D\uDE22"), /*#__PURE__*/ React.createElement("h1", {
        __source: {
            fileName: "index.tsx",
            lineNumber: 121,
            columnNumber: 15
        },
        __self: this
    }, "Pokemon not found")), /*#__PURE__*/ React.createElement("input", {
        className: "poke-input",
        type: "text",
        value: value,
        onchange: (e)=>setValue(e.target.value),
        placeholder: "Enter Pok\xe9mon name Or Number",
        __source: {
            fileName: "index.tsx",
            lineNumber: 124,
            columnNumber: 11
        },
        __self: this
    })), /*#__PURE__*/ React.createElement("div", {
        className: "poke-history",
        __source: {
            fileName: "index.tsx",
            lineNumber: 132,
            columnNumber: 9
        },
        __self: this
    }, history?.map((item)=>/*#__PURE__*/ React.createElement("div", {
            className: "history-item",
            onclick: (e)=>setValue(e.target.id),
            __source: {
                fileName: "index.tsx",
                lineNumber: 134,
                columnNumber: 13
            },
            __self: this
        }, /*#__PURE__*/ React.createElement("img", {
            id: item.id,
            className: "history-img",
            src: item.sprite,
            alt: "pokemon",
            __source: {
                fileName: "index.tsx",
                lineNumber: 138,
                columnNumber: 15
            },
            __self: this
        }))))));
};
const render = (element, container)=>{
    if ([
        "string",
        "number"
    ].includes(typeof element)) {
        container.appendChild(document.createTextNode(String(element)));
        return;
    }
    if (Array.isArray(element)) {
        element.forEach((el)=>render(el, container));
        return;
    }
    const actualDomElement = document.createElement(element?.tag);
    // console.log(`actualDomElement`, actualDomElement);
    if (element?.props) {
        const keys = Object.keys(element.props);
        const filteredKeys = keys.filter((key)=>key !== "children");
        filteredKeys.forEach((key)=>{
            // console.log(`actualDomElement[key]`, actualDomElement[key]);
            // console.log(`element.props[key]`, element.props[key]);
            return actualDomElement[key] = element.props[key];
        });
    }
    if (element?.props?.children) element.props.children.forEach((child)=>{
        render(child, actualDomElement);
    });
    container.appendChild(actualDomElement);
};
const rerender = ()=>{
    storeCursor = 0;
    document.getElementById("root").firstChild?.remove();
    render(/*#__PURE__*/ React.createElement(App, {
        __source: {
            fileName: "index.tsx",
            lineNumber: 186,
            columnNumber: 10
        },
        __self: this
    }), document.getElementById("root"));
    document.getElementsByClassName("poke-input")[0]?.focus();
};
render(/*#__PURE__*/ React.createElement(App, {
    __source: {
        fileName: "index.tsx",
        lineNumber: 192,
        columnNumber: 8
    },
    __self: this
}), document.getElementById("root"));

//# sourceMappingURL=index.ad9a7e97.js.map
