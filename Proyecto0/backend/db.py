
import json
import os
import psycopg2

from dotenv import dotenv_values

config = dotenv_values(".env")  

def get_db_connection():
    print(config['HOST'])

    connection = psycopg2.connect(
        host=config['HOST'],
        port=config['PORT'],
        database=config['POSTGRES_DB'],
        user=config['USER'],
        password=config['PASSWORD']
    )
    return connection


def read_from_db(query, params=None):

    conn = get_db_connection()

    cursor = conn.cursor()
    cursor.execute(query, params)
    
    columns = [desc[0] for desc in cursor.description]

    result = [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

    cursor.close()
    conn.close()
    return result

def write_to_db(query, params=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    conn.commit()
    cursor.close()
    conn.close()