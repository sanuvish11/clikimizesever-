<?php 

header('Access-Control-Allow-Origin: *');
function getSiteList(){
  //$jsonData = array('site_name' => 'd72a25f0');
   $curl = curl_init();
   curl_setopt_array($curl, array(
   CURLOPT_URL => "https://api.duda.co/api/sites/multiscreen?site_name='d72a25f0'",
   CURLOPT_RETURNTRANSFER => true,
   CURLOPT_ENCODING => "",
   CURLOPT_MAXREDIRS => 10,
   CURLOPT_TIMEOUT => 0,
   CURLOPT_FOLLOWLOCATION => true,
   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
   CURLOPT_CUSTOMREQUEST => "POST",
   CURLOPT_POSTFIELDS =>'',
   CURLOPT_HTTPHEADER => array(
    "authorization: Basic YTQwYjUyNDhmMDpyYWNaWW9yNzdLN24=",
    "content-type: application/json",
  ),
));

$response = curl_exec($curl);
curl_close($curl);
print_r($response);
return $response;	

}

function getAllTemplate()
{
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api.duda.co/api/sites/multiscreen/templates",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 0,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	  CURLOPT_HTTPHEADER => array(
	    "authorization: Basic YTQwYjUyNDhmMDpyYWNaWW9yNzdLN24="
	  ),
	));
 
	$response = curl_exec($curl);
	curl_close($curl);
	return  $response;
} 
function getAllPermissions()
{    /*
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api.duda.co/api/accounts/permissions/multiscreen",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 0,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	  CURLOPT_HTTPHEADER => array(
	    "authorization: Basic YTQwYjUyNDhmMDpVczF6UnVZTFMyOHA="
	  ),
	));

	$response = curl_exec($curl);
	curl_close($curl);
	return  $response;
	*/
	return "getAllPermissions";
}
function getSitePermissions($site_name,$account_name)
{
	/*
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api.duda.co/api/accounts/".$account_name."/sites/".$site_name."/permissions",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 0,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	  CURLOPT_HTTPHEADER => array(
	    "authorization: Basic YTQwYjUyNDhmMDpVczF6UnVZTFMyOHA="
	  ),
	));

	$response = curl_exec($curl);
	curl_close($curl);
	return  $response;
	*/
	return "getSitePermissions";
}
function createWebsite($templateId)
{
	/*
	$jsonData = array(
    'template_id' => $templateId);
   $curl = curl_init();
   curl_setopt_array($curl, array(
   CURLOPT_URL => "https://api.duda.co/api/sites/multiscreen/create",
   CURLOPT_RETURNTRANSFER => true,
   CURLOPT_ENCODING => "",
   CURLOPT_MAXREDIRS => 10,
   CURLOPT_TIMEOUT => 0,
   CURLOPT_FOLLOWLOCATION => true,
   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
   CURLOPT_CUSTOMREQUEST => "POST",
   CURLOPT_POSTFIELDS =>json_encode($jsonData),
   CURLOPT_HTTPHEADER => array(
    "authorization: Basic YTQwYjUyNDhmMDpVczF6UnVZTFMyOHA=",
    "content-type: application/json",
  ),
));

$response = curl_exec($curl);
curl_close($curl);
return $response;	
   */
   return "createWebsite";
}

function createPermissions($account_name,$site_name)
{  /*
	$jsonData = array(
    'permissions' => array('STATS_TAB','EDIT','PUBLISH','REPUBLISH','SEO'));
   $curl = curl_init();
   curl_setopt_array($curl, array(
   CURLOPT_URL => "https://api.duda.co/api/accounts/".$account_name."/sites/".$site_name."/permissions",
   CURLOPT_RETURNTRANSFER => true,
   CURLOPT_ENCODING => "",
   CURLOPT_MAXREDIRS => 10,
   CURLOPT_TIMEOUT => 0,
   CURLOPT_FOLLOWLOCATION => true,
   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
   CURLOPT_CUSTOMREQUEST => "POST",
   CURLOPT_POSTFIELDS =>json_encode($jsonData),
   CURLOPT_HTTPHEADER => array(
    "authorization: Basic YTQwYjUyNDhmMDpVczF6UnVZTFMyOHA=",
    "content-type: application/json",
  ),
));

$response = curl_exec($curl);
curl_close($curl);
return $response;	
*/
return "createPermissions";
}

function createAccount()
{  
   
	$jsonData = array(
    'account_type' => "CUSTOMER",
    'account_name' => $data['email'],
    'first_name' => $data['name'],
    'last_name' => '',
    'lang' => "en",
    'email' => $data['email'],
  );
 
   $curl = curl_init();
   curl_setopt_array($curl, array(
   CURLOPT_URL => "https://api.duda.co/api/accounts/create",
   CURLOPT_RETURNTRANSFER => true,
   CURLOPT_ENCODING => "",
   CURLOPT_MAXREDIRS => 10,
   CURLOPT_TIMEOUT => 0,
   CURLOPT_FOLLOWLOCATION => true,
   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
   CURLOPT_CUSTOMREQUEST => "POST",
   CURLOPT_POSTFIELDS =>json_encode($jsonData),
   CURLOPT_HTTPHEADER => array(
    "authorization: Basic YTQwYjUyNDhmMDpyYWNaWW9yNzdLN24=",
    "content-type: application/json",
  ),
));

$response = curl_exec($curl);
curl_close($curl);
return $response;	

return "createAccount";
}
function getCustomerSites($account_name)
{
	/*
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api.duda.co/api/accounts/grant-access/".$account_name."/sites/multiscreen",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 0,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	  CURLOPT_HTTPHEADER => array(
	    "authorization: Basic YTQwYjUyNDhmMDpVczF6UnVZTFMyOHA="
	  ),
	));

	$response = curl_exec($curl);
	curl_close($curl);
	return  $response;
   */
   return "getCustomerSites";
}



function getSiteName()
{  

	
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api.duda.co/api/sites/multiscreen/0314db71",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 0,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	  CURLOPT_HTTPHEADER => array(
		"authorization: Basic YTQwYjUyNDhmMDpyYWNaWW9yNzdLN24=",
		"content-type: application/json",
	  ),
	));

	$response = curl_exec($curl);
	curl_close($curl);
	return  $response;
}

?>