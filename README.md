# frontend

> frontend application for [Dequu Backend](https://github.com/hpi-bp1819-naumann/backend)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Troubleshooting

There might be problems with Cross-Origin Resource Sharing (CORS) because the Backend will run on `localhost:8080` and the frontend will run `localhost:3000`.

``` bash

# run the following command <chrome.exe-location> --disable-web-security --user-data-dir="<abitrary directory>"
# e.g.
./chrome.exe --disable-web-security --user-data-dir="C:/Chrome dev session"
```

### Used Technologies

1. [Vue Material](https://vuematerial.io/) for CSS
2. [Plotly.js](https://plot.ly/javascript/) for Graph Visualization
