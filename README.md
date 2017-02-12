# Cat Things
 Cat things is a lightweight inventory control system developed for the CAT.
 Cat things will keep track of inventory levels, track usage trends,
 create shopping lists, and send alerts on low inventory.

## API install instructions
1. Prerequisite: [node.js](https://nodejs.org/en/) must be installed on your machine before proceeding  

2. Open a console and navigate to the THINGS/API/things-api directory then execute    

       ```bash
       npm install
       ```
3. Create a file in API/things-api/conf/db/db_info.js
4. Add the following lines  

       ```javascript
       exports.config = {  
         user: 'username', //env var: PGUSER
         database: 'databasename', //env var: PGDATABASE  
         password: 'secret',  //env var: PGPASSWORD
         host: 'hostname',  // Server hosting the postgres database
         port: 5432,  //env var: PGPORT
         max: 10,  // max number of clients in the pool
         idleTimeoutMillis: 30000,  // how long a client is allowed to remain idle before being closed
       };  
       ```
5. Fill in the proper data to connect to your database.
6. Create a self-signed SSL certificate:
       (Prerequisite: openssl installed via npm insall -g openssl)
       Execute the following from the thigns-api directory:
       ```bash
       mkdir conf/ssl
       cd conf/ssl
       openssl genrsa -des3 -passout pass:x -out server.pass.key 2048

       openssl rsa -passin pass:x -in server.pass.key -out server.key
       rm server.pass.key
       openssl req -new -key server.key -out server.csr

       ```
       fill out the fields when prompted.  leave the optional fields blank.
       then execute the following:
       ```bash
       openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
       rm server.csr
       chmod 600 ./*
       ```
7. Create a key to sign your json web tokens:
        create a file called things-api/conf/jwtSecret.key
        wite 256 bytes of random data to the file. this is easily done from
        an online random number generator and copy pasted in.
        this link will give you a random 256 bytes, just copy it into the file.
        https://www.random.org/cgi-bin/randbyte?nbytes=256&format=h
8. Launch the server from the things-api directory with

       ```bash
       npm start
       ```
_this section should be updated regularly_

## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/Capstone-Things/THINGS/edit/master/README.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/Capstone-Things/THINGS/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.


### Luke was here.
