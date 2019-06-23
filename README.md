# eslint-plugin-teemill

Teemill eslint plugin

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-teemill`:

```
$ npm install eslint-plugin-teemill --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-teemill` globally.

## Usage

Add `teemill` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "teemill"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "teemill/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





