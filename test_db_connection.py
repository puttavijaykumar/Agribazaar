import mysql.connector

try:
    # Establish the connection
    conn = mysql.connector.connect(
        host="mainline.proxy.rlwy.net",#mysql.railway.internal
        user="root",
        password="YgHihGOQauBRHDQzhoJGXApMDgEecNZm", #Vijay@2025sql",
        database="railway",
        port=59144
        
    )

    # Check if the connection is successful
    if conn.is_connected():
        print("✅ Database connection successful!")
    else:
        print("❌ Failed to connect.")

except mysql.connector.Error as err:
    print(f"❌ Error: {err}")

finally:
    # Close the connection
    if 'conn' in locals() and conn.is_connected():
        conn.close()
        print("🔌 Connection closed.")
