<?php
$name = $_REQUEST['url'];
$type = $_REQUEST['type'];

function deleteDir ($name){
    //先删除目录下的文件：
    $dh = opendir(iconv("UTF-8","gbk",$name));
    while ($file = readdir($dh)) {
        if($file != "." && $file!="..") {
            $fullpath = $name."/".$file;
            if(!is_dir($fullpath)) {
                unlink($fullpath);
            } else {
                deleteDir($fullpath);
            }
        }
    }
    closedir($dh);

    //删除当前文件夹：
    if(rmdir($name)) {
        return true;
    } else {
        return false;
    }
}
if($type == 'file'){
    if (!unlink(iconv("UTF-8","gbk",$name))){
      echo ("删除失败");
    }else{
      echo ("删除成功");
    }
}else if($type == 'dir'){
    $re = deleteDir($name);
    if($re){
        echo ('删除文件夹成功');
    }else{
        echo ('删除出错');
    }
}

