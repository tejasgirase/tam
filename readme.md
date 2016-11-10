## Make Sure nodejs is installed on deployment server

Step 1 : cd /path/to/your/project

Step 2 : sudo npm install

Step 3 : Make sur all necessary ENV variables are set as described below.

Step 4 : gulp forever_start
			   (couchapp push for db5, db5_pi, users db and then only start node server as deamon with forever)

Step 5 : gulp forever_restart
				 (run this when you want your changes to be updated on server)


#### As of Now we are maintaining two config files. one for front end code(jquery code) and one for Node JS(3rd tier).

##### For Followings Configuration Options, Environemnt variable must be created (NODE JS)
FilePath :-> config.js


|ENV Variable|Description|Example|
|---|---|---|
|"PORT"|Port On Which Express Server Will Listen|55554|
|"Username"|Cloudant Username|"nirmalpatel59"|
|"UserPassword"|Cloudant Password|"nirmal"|
|"CLOUDANT_API_KEY"|Cloudant Api Key|"irldeadifecondecturponda"|
|"CLOUDANT_PASSWORD"|Cloudant Api Password|"0b86279b5be376c211c43493d854d7bf1e4db832"|
|"CLOUDANT_PORT"|Cloudant Port|443(Default port)|
|"USER_DB"|User Database|"yhs*******"|
|"DB"|Cloud Medical Info Database Name|"meluha_db5"|
|"PI_DB"|Cloud Personal Info Database Name|"meluha_db5_pi"|
|"SESSION_DB"|User Session Info Database Name|"sessions"|
|"MAIL_API_KEY"|Mailgun Api Key|"key-2e1c148b591cdd5767904c9e482b34ce"|
|"MAIL_DOMAIN"|Mailgun Domain Name|"mg.sensoryhealthsystems.com"|
|"MAIL_ID"|Sender Mail ID|"Sensory Health Systems Admin <noreply@sensoryhealthsystems.com>"|
|"IV"|Initialization Vector (Used for Encryption)|"EK9Hd0Ahf5PJ8eS8"|
|"SECRET_KEY"|Secret Key (Used for Encryption)|"sterceSllAfOterceSehT"|



##### Followings are Configuration Options availabel at config.js (Jquery)
FilePath :->  public/_attachments/script/config.js

|Field|Description|Example|
|---|---|---|
|"db"|Cloud Medical Info Database Name|"meluha_db5"|
|"personal_details_db"|Cloud Personal Info Database Name|"meluha_db5_pi"|
|"replicated_db"|Users Replicated Database Name|"yhsqizvkmp"|
