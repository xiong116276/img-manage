<?php
    header("Content-Type:application/json,charset=utf-8");
    $conn = mysqli_connect('bdm28760038.my3w.com','账号','密码','bdm28760038_db',3306);

    $uname=$_REQUEST["uname"];
    $upassword=$_REQUEST["upassword"];

    $sql = "SET NAMES UTF8";
    mysqli_query($conn,$sql);

    $output=array();

    $sql = "SELECT upassword FROM noteAccount where uname='$uname'";
    $result = mysqli_query($conn,$sql);

    $row=mysqli_fetch_assoc($result);

    if(empty($row)){
        $output['state']=0;//账号错误
    }else if($row['upassword'] === $upassword){
        $output['state']=1;//登录成功
    }else{
        $output['state']=2;//密码错误
    }

    echo json_encode($output);
?>