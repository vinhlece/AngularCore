## Running custom elements (for development):

- Build & watch custom elements app: `ng build embedded --watch`
- Build & watch worker app: `ng build worker --watch`
- Start sample dashboard info server: `npm run start:backend:sample`
- Start sample real time server: `npm run watch-server`
- Start assets server: `npm run assets-server`
- Start server for serving our html file: `npm run http-server -- -p 8000 -c-1`

Now, go to <http://localhost:8000/demo/custom-elements> to see the result.

Some features are disabled when running widget launcher as custom element: drag n drop, resize, minimize, maximize, delete, show time line

## How to use:
Add these scripts and style at the head tag:

- jQuery & jQuery UI:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
```
- Material Design Icons:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

Include custom element script at the end of body tag: `runtime.js, polyfills.js, scripts.js, styles.js, vendor.js, main.js`

#### Use time explorer: 

```html
<time-explorer></time-explorer>
```

#### Use widget launcher:
```html
<widget-launcher placeholder-id="id_of_placeholder"></widget-launcher>
```
Available attributes:
* `placeholder-id`: id of the launcher item after it is added to the dashboard
* `background-color`:
    - default value when not set: `#ffffff`
    - `inherit`: inherit from its direct parent. In order to make this option work, we must set `background-color` css property of parent element directly because `background-color` does not inherited by default
    - any hex color
* `color`:
    - default value when not set: `#333333`
    - `inherit`: inherit from its direct parent.
    - any hex color
* `font`:
    - default value when not set: `Roboto`
    - `inherit`: inherit from its direct parent.
    - any valid font
