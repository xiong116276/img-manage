<?php
// 允许上传的图片后缀
$url = $_POST['url'];
$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["img"]["name"]);
//echo $_FILES["img"]["size"];
$extension = end($temp);     // 获取文件后缀名
if ((($_FILES["img"]["type"] == "image/gif")
|| ($_FILES["img"]["type"] == "image/jpeg")
|| ($_FILES["img"]["type"] == "image/jpg")
|| ($_FILES["img"]["type"] == "image/pjpeg")
|| ($_FILES["img"]["type"] == "image/x-png")
|| ($_FILES["img"]["type"] == "image/png"))
&& ($_FILES["img"]["size"] < (500*1024))   // 小于 500 kb
&& in_array($extension, $allowedExts)){
    if ($_FILES["img"]["error"] > 0){
        echo "错误";
    }else{
//        echo "上传文件名: " . $_FILES["img"]["name"] . "<br>";
//        echo "文件类型: " . $_FILES["img"]["type"] . "<br>";
//        echo "文件大小: " . ($_FILES["img"]["size"] / 1024) . " kB<br>";
//        echo "文件临时存储的位置: " . $_FILES["img"]["tmp_name"] . "<br>";

        // 判断当期目录下的 upload 目录是否存在该文件
        // 如果没有 upload 目录，你需要创建它，upload 目录权限为 777
        if (file_exists($url.iconv("UTF-8","gbk",$_FILES["img"]["name"]))){
            echo "文件已经存在";
        }else{
            // 如果 upload 目录不存在该文件则将文件上传到 upload 目录下
            move_uploaded_file($_FILES["img"]["tmp_name"],$url.iconv("UTF-8", "gbk",$_FILES["img"]["name"]));
            echo "上传成功";
        }
    }
}else{
    echo "非法的文件格式";
}
