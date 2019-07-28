FROM nginx:1.15-alpine
COPY ./nginx_conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx_conf/nginx.conf /etc/nginx/nginx.conf
COPY ./dist /usr/share/nginx/html
CMD sed -e "s/ENV_PORT/$PORT/g" /etc/nginx/nginx.conf > /etc/nginx/nginx.conf

CMD nginx -g "daemon off;"