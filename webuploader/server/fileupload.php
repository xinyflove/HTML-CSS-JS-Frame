<?php
if (empty($_FILES['file']['name'])) {
	$result['message'] = '上传失败, 请选择要上传的文件！';
	die(json_encode($result));
}

if ($_FILES['file']['error'] != 0) {
	$result['message'] = '上传失败, 请重试.';
	die(json_encode($result));
}

$ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
$ext = strtolower($ext);
$size = intval($_FILES['file']['size']);
$originname = $_FILES['file']['name'];

$time = time();
$dir = 'upload/default'.'/'.date('Y', $time).'/'.date('m', $time);
$dir_array = explode('/', $dir);

$tmp_base_path = str_replace('\server', '', __DIR__);
foreach ($dir_array as $k => $v){
    $tmp_base_path = $tmp_base_path.'/'.$v;
    if(!is_dir($tmp_base_path)){
        if (!@mkdir($tmp_base_path,0755,true)){
            json_encode(array('code'=>'403', 'message'=>'创建目录失败，请检查是否有写入权限'));
            return false;
        }
    }
}

$filename = md5($time.rand(100, 999)).$ext;

$pathname = $tmp_base_path.'/'.$filename;

var_dump($pathname);die;
