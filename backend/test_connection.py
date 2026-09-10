from database import get_connection

try:
    connection = get_connection()

    cursor = connection.cursor()
    cursor.execute("SELECT 'Oracle connection successful!' FROM dual")

    result = cursor.fetchone()

    print(result[0])

    cursor.close()
    connection.close()

except Exception as e:
    print("Connection failed:")
    print(e)