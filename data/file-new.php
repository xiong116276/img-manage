<?php
header('Content-Type:application/json;charset:utf-8');
$url = $_REQUEST['url'];
$fileName = $_REQUEST['fileName'];

//$outPut = (object)array();
if(!is_dir(iconv("gbk","UTF-8",$url.$fileName))){
    mkdir(iconv("gbk","UTF-8",$url.$fileName),0777);
    echo json_encode('创建成功');
}else{
    echo json_encode('文件夹已存在!');
}
