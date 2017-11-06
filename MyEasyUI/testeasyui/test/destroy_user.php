<?php

if(empty($_POST['id']))
{
	echo json_encode(array('errorMsg' => '删除失败1'));
}
else
{
	$con = @mysql_connect('localhost', 'root', '');
	if(!$con) die('Could not connect: ' . mysql_error());

	mysql_select_db("test", $con);

	$id = $_POST['id'];

	$sql = "DELETE FROM users WHERE id = {$id}";
	$res = mysql_query($sql);	// 插入成功返回true

	if($res)
	{
		echo json_encode(array('success' => 1));
	}
	else
	{
		echo json_encode(array('errorMsg' => '删除失败2'));
	}
	
}

?>