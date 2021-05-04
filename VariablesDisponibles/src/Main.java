import java.sql.Connection;
import java.sql.SQLException;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import com.mysql.cj.jdbc.CallableStatement;
import javax.xml.soap.*;

public class Main {
	    
	    public static void main(String[] args) {
			
	    	String url = "https://www.banguat.gob.gt/variables/ws/TipoCambio.asmx?WSDL";
	    	String soapAction = "http://www.banguat.gob.gt/variables/ws/VariablesDisponibles";
	    	
	    	SOAPBody respuestaBANGUAT = peticionSOAP(url, soapAction);
			
	    	if(respuestaBANGUAT != null){
	    		AlmacenarRegistros(respuestaBANGUAT);
	    	} else {
	    		System.out.println("No sé obtuvo respuesta del WS.");
	    	}
	    	
		}

    private static SOAPBody peticionSOAP(String url, String soapAction) {
        try {
            // Creamos la conexion SOAP
            SOAPConnectionFactory connectionFactory = SOAPConnectionFactory.newInstance();
            SOAPConnection soapConnection = connectionFactory.createConnection();

            MessageFactory messageFactory = MessageFactory.newInstance();
            SOAPMessage soapMessage = messageFactory.createMessage();

            // Agregamos los encabezados
            MimeHeaders headers = soapMessage.getMimeHeaders();
            headers.addHeader("SOAPAction", soapAction);

            soapMessage.saveChanges();
            
            // Realizamos la llamada
            SOAPMessage soapResponse = soapConnection.call(soapMessage, url);

            SOAPBody soapBody = soapResponse.getSOAPBody();
                                                
            soapConnection.close();
            
            return soapBody;
        } catch (Exception e) {
        	throw new RuntimeException(e);
        }
    }
    
    private static void AlmacenarRegistros(SOAPBody soapBody){
    	// Declaramos variables de conexion
    	Conexion conexion = new Conexion();
		Connection cnn = null;
		
		// Creamos lista de variales
    	NodeList lista = soapBody.getElementsByTagName("Variable");
        
        int moneda = 0;
        String descripcion = "";
        
        String query = "{call insertarMoneda(?,?)}";
        CallableStatement callStm = null;
         
    	try {
    		
    		// Abrimos la conexion`
    		cnn = conexion.conectar();
    		
    		for (int i = 0; i < lista.getLength(); i++) {
    			Node node = (Node)lista.item(i);
    			
    			Element variable = (Element)node;
    			NodeList listaHijos = variable.getChildNodes();
    			
    			moneda = Integer.parseInt(((Node)listaHijos.item(0)).getValue().trim());
    			descripcion = ((Node)listaHijos.item(1)).getValue().trim();
    			
    			if(moneda % 2 == 0){    				
    				callStm = (CallableStatement) cnn.prepareCall(query);
    				callStm.setInt(1, moneda);
    				callStm.setString(2, descripcion);
    				
    				callStm.executeQuery();
    				
    				
    				System.out.println("Codigo: " + moneda + ", Descripcion: " + descripcion);
    			}
				
    		}	
    		
		} catch (SQLException e) {
			e.printStackTrace();
		} 

			
    }

	       
	    
}
