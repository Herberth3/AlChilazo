import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import '../../styles/style-delivery-reg.css';
import InputGroup from 'react-bootstrap/InputGroup';
import UploadFile from '../Empresa/UploadFile';
const ControlFormGroupElement =
  ({   /*classNameData = "mb-3",*/ 
  setDatos,
  datos,
  controlIdData = "Id",
  placeholderData = "Ingrese el dato", 
  typeData = "input", 
  inputType = "text",
  rowsData = 1,
  selecteValue = {}, 
  required = false, 
  readOnly = false, 
  disabled = false, 
  sizeTextData = ""}) => {
  const formLabelData = controlIdData;
  const formControlType = getFormControlType(typeData, inputType, placeholderData, rowsData);
  const sizeFormControl = getSizeFormControl(sizeTextData);
  const booleanAtributes = {required, readOnly, disabled};  
  const targetAttr = convertirString(controlIdData);
  //Establecemos la funcion de cambio en los input o select
  const onChange = (e) => {
    let newValue;
    if(targetAttr === "cv"){
      newValue = e;
    }else{
      newValue = e.target.value;
    }    
    setDatos((prevDatos) => ({
      ...prevDatos,
      [targetAttr]: newValue,
    }));
  }
  //Obtenemos el formElement, puede ser un select o un input (Form.Group)
  const formElement= (typeData === "select") ? 
                      getFormSelect(targetAttr, datos, sizeFormControl, disabled, onChange) : 
                      getFormControl(formControlType, sizeFormControl, booleanAtributes, onChange);
  return (
    <>
      <Form.Group className="container input-width" controlId={controlIdData}>
        <Form.Label >
          {formLabelData}
        </Form.Label>
        <Col>
          {formElement}
        </Col>
      </Form.Group>
    </>
  );
};

/**
 * Esta version solo muestra inputs de cada elemento de datos 
 * y agrega un boton para ejecutar un onclickButton
 * para repartidor el oncliclButton sirve para desplegar el 
 * dato a modioficar
 * @param {*} param0 
 * @returns 
 */
export const ControlViewGroupElement =
  ({   /*classNameData = "mb-3",*/ 
  valueData = "",
  onclickButton,
  controlIdData = "Id",
  typeData = "input", 
  inputType = "text",
  rowsData = 1,
  selecteValue = {}, 
  sizeTextData = ""}) => {
  const formLabelData = controlIdData;
  const sizeFormControl = getSizeFormControl(sizeTextData);

  return (
    <>
      <Form.Group className="container input-width mb-1" controlId={controlIdData}>
      <InputGroup className="mb-3">
        <Button className='button-form-dev button-profile' id={"button-"+controlIdData} onClick={onclickButton}>
          {formLabelData}
        </Button>
        <Form.Control className="dv-form-input"
          type='text'
          value={valueData}
          {...sizeFormControl}
          readOnly={true}
        />
        </InputGroup>
      </Form.Group>
    </>
  );
};

/**
 * Retornamos un Form.Contrl, recibimos un objeto que contiene el tipo de input y sus respectivos valores
 * tipo: input --> type = text
 *       textarea --> as = textarea rows = 3
 * ademas se recibe el tam y si esta activo con sizeFormControl y booleanAtributes
 * tarjetAttr y setDatos son la forma en la que se va a cambiar el valor de cada campo, esto
 * para luego ser empaquetado en el formulario general
 * @param {*} formControlType 
 * @param {*} sizeFormControl 
 * @param {*} booleanAtributes 
 * @param {*} targetAttr 
 * @param {*} setDatos 
 * @returns 
 */
function getFormControl (formControlType, sizeFormControl, booleanAtributes, onChange){
  if(formControlType.type == "file"){
    
    //console.log("FormType: "+JSON.stringify(formControlType));
    //console.log("sizeFormControl: "+JSON.stringify(sizeFormControl));
    //console.log("booleanAtributes: "+JSON.stringify(booleanAtributes));
    //console.log("onChange: "+JSON.stringify(onChange));
    
    return(<>
      <UploadFile
        setSelectedFile={onChange}
        label={""}
        simpleLabel={"cv"}
        type={".png,.jpg,.jpeg,.pdf"}
        required={true}
      ></UploadFile>
    </>)
  }else{
    return (
      <>
        <Form.Control className="dv-form-input"
          {...formControlType}
          {...sizeFormControl}
          {...booleanAtributes}
          onChange={(e) => onChange(e)}
        />
      </>
    );
  }
}

/**
 * Retornamos un Form.Select
 * se recibe el tam de los form label
 * @param {*} sizeFormControl 
 * @param {*} disabled 
 * @returns 
 */
function getFormSelect (targetAttr, datos, sizeFormControl, disabled, onChange) {
  let options = getOptions(targetAttr, datos);

  return (
    <Form.Select {...sizeFormControl} disabled={disabled} aria-label="Mostrar opciones" onChange={(e) => onChange(e)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
}

/**
 * Se recibe el tipo de data, esto significa si es un input (con sus diversos tipos),
 * un textarea o un plaintext, si es un input se devuelve el type y el valor además de su placeholder,
 * si es un textarea se devuelve la cantidad de rows que tiene y el as: textarea
 * si es un plaintext solo se retorna ese valor
 * @param {*} typeData 
 * @param {*} inputType 
 * @param {*} placeholderData 
 * @param {*} rowsData 
 * @returns 
 */
function getFormControlType (typeData, inputType, placeholderData, rowsData){
  let formControlType;
  if (typeData === "input") {
    formControlType = { type: inputType, placeholder: placeholderData};
  } else if (typeData === "textarea") {
    formControlType = { as: "textarea", rows: rowsData};
  } else if (typeData === "plaintext") {
    formControlType = { plaintext: true };
  } else {
    formControlType = {};
  }

  return formControlType;
}

/**
 * Recibe un valor de tam del text, si no tiene nada se retorna un objeto vacio, de lo contrario se retorna un size con el valor enviado
 * @param {*} sizeTextData 
 * @returns 
 */
function getSizeFormControl (sizeTextData){
  let sizeFormControl;
  if(sizeTextData === "lg" || sizeTextData === "sm"){
    sizeFormControl = {size: sizeTextData};
  }else{
    sizeFormControl = {};
  }
  
  return sizeFormControl;
}

function convertirString(cadena) {
  // Convertir a minúsculas
  let resultado = cadena.toLowerCase();  
  // Remover los puntos y espacios en blanco
  resultado = resultado.replace(/\./g, '').replace(/\s/g, ''); 
  return resultado;
}

function getOptions(targetAttr, datos){
  let options = [
    { value : "-1", label: targetAttr }
  ];

  if(targetAttr === "departamento"){
    const listado = datos.departamentosLista;
    listado.map((dato) => (
      options = [options, {
        value: dato.idDepartamento,
        label: dato.departamento
      }].flat()
    ))
  }else if(targetAttr === "ciudad"){
    const listado = datos.ciudadesLista;
    listado.map((dato) => (
      options= [options, {
        value: dato.idMunicipio,
        label: dato.municipio
      }].flat()
    ))
  }else if(targetAttr === "vehiculo"){
    const listado = [{id: 0, label: "No tengo vehiculo propio"}, {id: 1, label: "Tengo vehiculo propio"}];
    listado.map((dato) => (
      options = [options, {
        value: dato.id,
        label: dato.label
      }].flat()
    ))
  }else if(targetAttr === "licencia"){
    const listado = [{id: "A", label: "A"}, {id: "B", label: "B"}, {id: "C", label: "C"}, {id: "M", label: "M"}, {id: "E", label: "E"}];
    listado.map((dato) => (      
      options = [options, {
        value: dato.id,
        label: dato.label
      }].flat()
    ))
  }      

  return options;
}

export default ControlFormGroupElement;
