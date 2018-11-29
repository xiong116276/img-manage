<?php
$file = $_REQUEST['url'];
if (!unlink(iconv("UTF-8","gbk",$file))){
  echo ("删除失败");
}else{
  echo ("删除成功");
}
