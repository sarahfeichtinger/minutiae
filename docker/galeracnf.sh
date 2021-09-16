#!/bin/sh

touch /etc/mysql/conf.d/galera.cnf

text="[mysqld]
binlog_format=ROW
default-storage-engine=innodb
innodb_autoinc_lock_mode=2
bind-address=0.0.0.0

# Galera Provider Configuration
wsrep_on=ON
wsrep_provider=/usr/lib/galera/libgalera_smm.so

# Galera Cluster Configuration
wsrep_cluster_name=""\"test_cluster""\"
wsrep_cluster_address=""\"gcomm://first_ip,second_ip,third_ip""\"

# Galera Synchronization Configuration
wsrep_sst_method=rsync

# Galera Node Configuration
wsrep_node_address=""\"this_node_ip""\"
wsrep_node_name=""\"this_node_name""\""

echo $text > /etc/mysql/conf.d/galera.cnf
 
