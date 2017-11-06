<?php

/*$arr_user = array(
	array(
		'firstname' =>'fname1',
		'lastname' => 'lname1',
		'phone' => '(000)000-0000',
		'email' => 'name1@gmail.com',
		),
	array(
		'firstname' =>'fname2',
		'lastname' => 'lname2',
		'phone' => '(000)000-0000',
		'email' => 'name2@gmail.com',
		),
	array(
		'firstname' =>'fname3',
		'lastname' => 'lname3',
		'phone' => '(000)000-0000',
		'email' => 'name3@gmail.com',
		),
	array(
		'firstname' =>'fname4',
		'lastname' => 'lname4',
		'phone' => '(000)000-0000',
		'email' => 'name4@gmail.com',
		),
	array(
		'firstname' =>'fname5',
		'lastname' => 'lname5',
		'phone' => '(000)000-0000',
		'email' => 'name5@gmail.com',
		),
	array(
		'firstname' =>'fname6',
		'lastname' => 'lname6',
		'phone' => '(000)000-0000',
		'email' => 'name6@gmail.com',
		),
	array(
		'firstname' =>'fname7',
		'lastname' => 'lname7',
		'phone' => '(000)000-0000',
		'email' => 'name7@gmail.com',
		),
	array(
		'firstname' =>'fname8',
		'lastname' => 'lname8',
		'phone' => '(000)000-0000',
		'email' => 'name8@gmail.com',
		),
	);*/

$con = @mysql_connect('localhost', 'root', '');
if(!$con) die('Could not connect: ' . mysql_error());

mysql_select_db("test", $con);
$res = mysql_query("SELECT * FROM users");

$result = array();
while($row = mysql_fetch_assoc($res)){
	array_push($result, $row);
}

mysql_close($con);

echo json_encode($result);

?>