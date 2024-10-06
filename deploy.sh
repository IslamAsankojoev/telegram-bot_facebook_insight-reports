#!/bin/bash

# Пересобираем образ
docker build -t my-telegram-bot .

# Останавливаем и удаляем старый контейнер
docker stop telegram-bot
docker rm telegram-bot

# Запускаем новый контейнер
docker run -d --name telegram-bot my-telegram-bot

