import java.sql.Connection;
import java.sql.DriverManager;

public class Conexion {
	
	private static final String url = "jdbc:mysql://127.0.0.1:3306/variablesdisponibles";
	private static final String usuario = "root";
	
	
	public Connection conectar() {
		
		Connection conexion = null;
		
		try {
			
			Class.forName("com.mysql.cj.jdbc.Driver");
			
			conexion = DriverManager.getConnection(url, usuario, "");		
			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		
		return conexion;
	}
	
}
