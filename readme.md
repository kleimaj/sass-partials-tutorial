# Setting up Partials and SASS with a Node/Express project

## EJS Layouts

Adding partials can dry up the code a bit, but [EJS Layouts](https://www.npmjs.com/package/express-ejs-layouts)  can take this modularity even farther and make a big diffence with large applications.
EJS layouts is a node package that allows us to create a boilerplate (aka a layout) that we can inject content into based on which route is reached. Layouts normally include header and footer content that you want to display on every page (navbar, sitemap, logo, etc.).

### Install EJS Layouts

1. Install EJS layouts

Install `express-ejs-layouts` via npm

```
npm install express-ejs-layouts
```

2. Set up EJS layouts

Require the module and add it to the app with `app.use()`.

<strong>server.js</strong>

```javascript
// require statements
const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts);

...
// middleware
app.set('view engine', 'ejs');
app.use(ejsLayouts);
```

3. Create a layout

In the root of the views folder, add a layout called `layout.ejs`. It must be called `layout.ejs`, as mandated by `express-ejs-layouts`.

<strong>layout.ejs</strong>

```javascript
<!DOCTYPE html>
<html>
<head>
  <title>Bob Loblaw's Law Blog</title>
</head>
<body>
  <%- body %>
</body>
</html>
```

4. In the views folder, edit the `home.ejs` file to remove the html, body, and head tags:

<strong>home.ejs</strong>

```javascript
<header>
  <h1>Welcome to the Blog</h1>
  <nav>
    <ul>
      <li>
        <a href="/authors">Authors</a>
      </li>
      <li>
        <a href="/articles">Articles</a>
      </li>
    </ul>
  </nav>
</header>
```

Now edit the home route in your `server.js` below the middleware:

```javascript
app.get('/', (req, res) => {
    res.render('home');
})
```

Ejs will assume that home means `home.ejs`. Now start nodemon and check that your home page renders as desired.

This layout will be used by all pages, and the content will be filled in where the `<%- body %>` tag is placed. `<%- body %>` is a special tag used by `express-ejs-layouts` that cannot be renamed.

5. Set up a few more views/routes

<strong>controllers/authors.js</strong>

Change `authors/index.ejs` to `authors/index`

```javascript
// PATH = /authors
router.get('/', (req, res) => {
    Author.find({}, (err, foundAuthors) => {
        if (err) console.log(error)

        res.render('authors/index', {
            authors: foundAuthors
        })
    })
})
```

<strong>authors/index.ejs</strong>

We will once again remove the outter html tags (`html, head, body`).

```javascript
<header>
  <h1>Authors</h1>
  <nav>
    <ul>
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/authors/new">Create a new Author</a>
      </li>
    </ul>
  </nav>
  </header>
  <main>
    <h2>List of Authors</h2>
    <ul>
      <% authors.forEach(author => { %>
        <li>
          <a href="/authors/<%= author._id %>"><%= author.name %></a>
        </li>
      <% }) %>
    </ul>
  </main>
```

6. Bonus: Add a navigation bar for every page

Add a simple navigation list to the top of the layout page so there's a navigation to every page from every page:

<strong>layout.ejs</strong>

```javascript
<!DOCTYPE html>
<html>
<head>
  <title>Bob Loblaw's Law Blog</title>
</head>
<body>
  <nav>
    <ul>
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/authors">Authors</a>
      </li>
      <li>
        <a href="/articles">Articles</a>
      </li>
    </ul>
  </nav>
  <%- body %>
</body>
</html>
```

You may be wondering why we're refactoring our code like this? It's important to reuse components (like the nav bar) so the server doesn't have to render additional EJS and ultimately enhances our efficiency and code reusability. In the next half of the lecture we will cover SASS, how to write it, how to compile it, and how to link it to our `layout.ejs` file.

## What is SASS?

[SASS (Syntactically Awesome Style Sheets)](https://www.learnhowtoprogram.com/css/sass/what-is-sass) is a CSS preprocessor. This basically extends the features of CSS and helps us keep our CSS DRY. As the SASS website puts it SASS is "CSS with superpowers". Other popular preprocessors include Less and Stylus.

SASS has a couple different formats - SASS and SCSS. SASS format removes the semi-colons and curly braces and SCSS does not. Thus, SCSS is a little easier for most programmers to read, so that's what we'll use in this tutorial.

## Step-by-step

1. Set up your static files and folder structure.
    * Create `public` folder in top level folder
    * Put the following line of code in your server.js
      
      ```javascript
      app.use(express.static(__dirname + '/public/'));
      ```

    * Inside the public folder, create a `css` folder.
    * Inside the css folder, create a `sass` folder.

2. Install some middleware that will compile the files for you

    `npm install -g node-sass`

3. Add to the scripts in your package.json

    `"sass": "node-sass public/css/sass/ -o public/css/"`

4. Create an SCSS file called `style.scss` in your sass folder

5. Put some code in it
    ```css
    $my_favorite_color: #0f0;
    $my_second_favorite_color: #00f;

    h1 {
      color: $my_favorite_color;
      &:hover {
        color: $my_second_favorite_color;
      }
    }
    ```

6. Run the command `npm run sass` that we added to package.json earlier.

    * Check it out, you should have a style.css in the parent folder now!

7. Add your new `style.css` file to your layout.ejs file. See it in action!
  ```javascript
  <link rel="stylesheet" type="text/css" href="css/style.css">
  ```
## Neat. What else does it do?

Check out the [guide on the SASS website](https://sass-lang.com/guide) for an overview on what SASS can do. In a nutshell, we can use it to enable CSS to work with variables, nesting, inheritance, partials, mixins, and operators. 

| The thing  | What it does |
| -------- | ----------------------------------------------- |
|`Variables`| Declare something for use at a later time, like in our example above.|
|`Nesting`| We can put the relevant code inside the parent instead of having to write a long queryselector.|
|`Inheritance`| We can extend code from somewhere else.|
|`Mixins`| We can write blocks of CSS for later reuse.|
|`Partials`| We can include code snippets.|
|`Operators`| You can use +, -, *, /, and % for glorious, glorious math.|

# References
* [SASS website](https://sass-lang.com/)
* [node-sass NPM](https://www.npmjs.com/package/node-sass)
* [node-sass Github](https://github.com/sass/node-sass)
