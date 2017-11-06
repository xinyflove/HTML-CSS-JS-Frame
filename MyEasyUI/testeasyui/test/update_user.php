<?php
if(empty($_GET['id']) || empty($_POST['firstname']) || empty($_POST['lastname']) || empty($_POST['phone']) || empty($_POST['email']))
{
	echo json_encode(array('errorMsg' => '修改失败'));
}
else
{

	$con = @mysql_connect('localhost', 'root', '');
	if(!$con) die('Could not connect: ' . mysql_error());

	mysql_select_db("test", $con);

	$firstname = $_POST['firstname'];
	$lastname = $_POST['lastname'];
	$phone = $_POST['phone'];
	$email = $_POST['email'];

	$sql = "UPDATE users SET firstname = '{$firstname}', lastname = '{$lastname}', phone = '{$phone}', email = '{$email}' WHERE id = {$_GET['id']}";
	$res = mysql_query($sql);	// 插入成功返回true

	if($res)
	{
		echo 1;
	}
	else
	{
		echo json_encode(array('errorMsg' => '修改失败'));
	}
}

?>