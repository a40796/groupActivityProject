#!/bin/bash

# 啟動後端服務
cd /home/app/BE
npm start &

# 在另一個端口上提供前端應用
cd /home/app/FE
serve -s dist -l 8080 &

# 等待後台任務結束（這將不會發生，除非有一個服務終止）
wait
