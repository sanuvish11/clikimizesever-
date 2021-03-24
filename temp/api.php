<?php 
include('apiservices.php');
$result=createAccount($_POST);
$siteid=createWebsite($_POST['template_id']);
print_r($siteid);die;
$sitename=json_decode($siteid);
echo $sitename->site_name;
?>