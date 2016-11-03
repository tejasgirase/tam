Make Sure nodejs is installed on deployment server

Step 0 : npm install forever -g

Step 1 : cd /path/to/your/project

Step 2 : sudo npm install

Step 3 : set all variables in config.json file

Step 4 : push public folder (which is couchapp) into db_5 (Other repos like pi_db and users db has to be pushed manually for now later will automate everything using gulp)

step 4 : forever start app.js