FROM mysql:5.7.26

# Environment variables
ENV MYSQL_ALLOW_EMPTY_PASSWORD yes \
    MYSQL_ROOT_PASSWORD secret \
    MYSQL_USER user \
    MYSQL_PASSWORD secret

ADD init.sql /docker-entrypoint-initdb.d

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD mysqladmin ping -h 127.0.0.1 -u user --password=secret

#PORT
EXPOSE 3306
