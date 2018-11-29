<?php
header('Content-Type:application/json;charset:utf-8');

//$conn = mysqli_connect('bdm28760038.my3w.com','bdm28760038','aa116276','bdm28760038_db',3306);
//$conn = mysqli_connect('localhost','root','','test',3306);
//$url = "../resources/";
$url = $_REQUEST['url'];
$handle = opendir($url);//获取当前目录

$array = array();
$dirs  = array();
//遍历该php文件所在的目录
while (($file = readdir($handle))!==false){
    //获取扩展名 list(var1,var2...)把数组中的值赋给一些变量; explode()打乱字符串为数组；js split();
    //$filesname 获取到文件名字；$kzm 获取到拓展名
    $file=iconv("gb2312","utf-8",$file);
    if(!is_dir($url.$file)){//文件夹过滤
        list($filesname,$kzm) = explode(".",$file);
        if($kzm=="gif"||$kzm=="jpg"||$kzm =="JPG"||$kzm=="JPEG"||$kzm == "png"||$kzm == "ico"){
            $array[]=$file;//把符合条件的文件名存入数组
        }
    }else{
        $dirs[]=$file;
    }
}

$outPut = (object)[
    'files' => $array,
    'dirs'  => $dirs
];

echo json_encode($outPut);