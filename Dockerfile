FROM kry9ton/wabot-image:latest

#
# Clone repo and prepare working directory
#
RUN git clone -b master https://Kry9toN:468213790d@github.com/Kry9toN/KryPtoN-WhatsApp-Bot /home/wabot
WORKDIR /home/wabot

RUN npm i

CMD ["npm", "start"]
