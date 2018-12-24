# node-mssql-cdc-kafka

Inspired by https://github.com/Vanlightly/CDC-Tools

This is scanning all the tables in [Configuration] db and streaming to kafka

cdc database has one table:

````
CREATE DATABASE CDC
GO
USE CDC
GO
CREATE SCHEMA CDC
GO
CREATE TABLE [CDC].[ChangeState]([ExecutionId] [varchar](50) NOT NULL,[TableName] [varchar](200) NOT NULL,[Lsn] [binary](10) NOT NULL,[SeqVal] [binary](10) NOT NULL,[LastUpdate] [datetime] NOT NULL,PRIMARY KEY CLUSTERED ([ExecutionId] ASC,[TableName] ASC))
GO
````

configuration database has cdc enabled..

````
exec sys.sp_cdc_enable_db
EXEC sys.sp_cdc_enable_table @source_schema = N'dbo', @source_name = N'StringParameters', @role_name = NULL, @supports_net_changes = 0 

...etc
````

to use native kafka libraries you need

````
RUN apt-get update
RUN apt-get install -y librdkafka-dev libsasl2-dev

````

see https://github.com/nodefluent/node-sinek/blob/master/lib/librdkafka/README.md for mac


to run..
config in config/defaukt.json

````
export CDC_CONNECTION='mssql://sa:SecretPassword!@sql/cdc'
export CONFIGURATION_CONNECTION='mssql://sa:SecretPassword!@sql/Configuration'
export KAFKA_HOST='broker:9092, broker1:9093, broker2:9094'

yarn start
````