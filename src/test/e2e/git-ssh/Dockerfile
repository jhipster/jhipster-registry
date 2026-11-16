# A Git server that is reached over SSH, for the end-to-end tests. Its host key, the keys it accepts and the
# repository it serves are mounted, see docker-compose.yml.
FROM alpine:3.22.2
RUN apk add --no-cache openssh-server git \
    && adduser -D -s /usr/bin/git-shell git \
    && echo 'git:*' | chpasswd -e \
    && git config --system --add safe.directory '*'
COPY sshd_config /etc/ssh/sshd_config
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D", "-e"]
