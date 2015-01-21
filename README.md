Brew it yourself
================


This web application  let you edit beer recipes. It is for brewers who needs advanced tools to estimate IBU, Alcohol, ...

----------


Installation
-------------

You need, first, to install NodeJs, grunt and bower on your machine:
http://nodejs.org/
```shell
npm install -g grunt-cli
npm install -g bower
```

You also need sass and compass (for scss compilation)
```shell
gem install sass
gem install compass
```

 Then, from the main folder :
```shell
npm install
bower install
```

Launch the application in development mode
------------------------------------------

```shell
grunt serve
```


Build the application
---------------------

```shell
grunt
```

This will create `dist.tgz`


Check the built application
---------------------------

```shell
grunt prod_check
```
