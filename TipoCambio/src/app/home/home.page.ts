import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { parseString } from 'xml2js';

export interface Cambio {
  compra: number;
  fecha: Date;
  moneda: number;
  venta: number;
}

export interface Busqueda {
  inicio: string;
  final: string;
  cantidad: number;
  venta: number;
  compra: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  type: string = "TipoCambio";

  public fechaInicio: Date = new Date();
  public fechaFinal: Date = new Date();
  public promVenta = 0;
  public promCompra = 0;

  listaCambio: Array<Cambio> = new Array<Cambio>();
  listaBusqueda: Array<Busqueda> = new Array<Busqueda>();

  constructor(protected http: HttpClient) {}

  consultar(){
    let inicio = this.crearFormatoFecha(this.fechaInicio.toString());
    let final = this.crearFormatoFecha(this.fechaFinal.toString());
    this.listaCambio = [];

    this.peticionWS(inicio, final);    
  }

  peticionWS(inicio: string, final: string) {
    const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <TipoCambioRango xmlns="http://www.banguat.gob.gt/variables/ws/">
          <fechainit>${inicio}</fechainit>
          <fechafin>${final}</fechafin>
        </TipoCambioRango>
      </soap:Body>
    </soap:Envelope>`;

    this.http
      .post(
        'https://www.banguat.gob.gt/variables/ws/TipoCambio.asmx',
        body,
        {
          responseType: 'text',
          headers: new HttpHeaders()
            .set('Content-Type', 'text/xml; charset=utf-8')
            .set(
              'SOAPAction',
              'http://www.banguat.gob.gt/variables/ws/TipoCambioRango'
            ),
        }
      )
      .subscribe(
        (result) => {
          this.conversion(result);
        },
        (error) => {
          console.log('Error =>', error);
        }
      );
  }

  async parseXml(xml) {
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            result['soap:Envelope']['soap:Body'][0].TipoCambioRangoResponse[0]
              .TipoCambioRangoResult[0].Vars[0].Var
          );
        }
      });
    });
  }

  async conversion(xml) {
    let listaDeCambios: any = await this.parseXml(xml);

    listaDeCambios.forEach((element) => {
      this.listaCambio.push({
        compra: Number.parseFloat(element['compra'][0]),
        fecha: element['fecha'][0],
        moneda: Number.parseInt(element['moneda'][0]),
        venta: Number.parseFloat(element['venta'][0]),
      });
    });

    this.verificarOAlmacenarBusqueda();
  }

  crearFormatoFecha(fecha: string){
    let conversion: string = "";
    conversion += fecha.substring(8,10);
    conversion += "/";
    conversion += fecha.substring(5,7);
    conversion += "/";
    conversion += fecha.substring(0,4);

    return conversion;
  }

  calcularPromedio(){
    let promVenta = 0;
    let promCompra = 0;
    let registros = this.listaCambio.length;

    this.listaCambio.forEach(item => {
      promCompra += item.compra,
      promVenta += item.venta
    })

    this.promCompra = promCompra / registros;
    this.promVenta = promVenta / registros;
  }

  verificarOAlmacenarBusqueda(){
    let seAlmacena: boolean = true;

    for (let i = 0; i < this.listaBusqueda.length; i++) {
      var element = this.listaBusqueda[i];
      seAlmacena = true;

      if (element.final == this.crearFormatoFecha(this.fechaFinal.toString()) && element.inicio == this.crearFormatoFecha(this.fechaInicio.toString())) {
        seAlmacena = false;
        element.cantidad += 1;
        this.listaBusqueda[i] = element;
        break;
      }
    }

    this.calcularPromedio();

    if (seAlmacena) {
      this.listaBusqueda.push({
        final: this.crearFormatoFecha(this.fechaFinal.toString()),
        inicio: this.crearFormatoFecha(this.fechaInicio.toString()),
        cantidad: 1,
        venta: this.promVenta,
        compra: this.promCompra,
      });
    }

  }

}
