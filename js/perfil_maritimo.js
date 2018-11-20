var   fecha = new Date()
    , anio_actual = fecha.getFullYear()
    , base= ""
    , minimo_lineas = 0
    , maximo_lineas = 0
    , data_lineas = {}
    , rutas = {}
    , relacion_puerto_servicio = {}
    , datos_servicios= {}
    , data_importacion_por_puerto = {}
    , data_exportacion_por_puerto = {}
    , data_naves_atracadas = []
    , data_tranferencia_maxima_glob = [];

var key = "157690435b9f65519b8dc20393517e2b4cbc1c23";

var url =
[
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/POBLA-DE-CHILE-2002-2020/data.ajson/?auth_key=",//0
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/ACUER-COMER-DE-CHILE/data.ajson/?auth_key=",//1
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/GLOBA-COMPE-INDEX/data.ajson/?auth_key=",//2
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/INDIC-LINER-SHIPP-CONNE/data.ajson/?auth_key=",//3
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/PARTI-DE-LOS-MODOS-DE/data.ajson/?auth_key=",//4
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/PIB-DE-CHILE-EN-88440/data.ajson/?auth_key=",//5
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/PRINC-PRODU-MINER-EXPOR/data.ajson/?auth_key=",//6
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/PRINC-PRODU-NO-MINER-EXPOR/data.ajson/?auth_key=",//7
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/PRINC-PRODU-COMBU-IMPOR/data.ajson/?auth_key=",//8
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/PRINC-PRODU-NO-COMBU-IMPOR/data.ajson/?auth_key=",//9
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/SERVI-NAVIE-EN-CHILE/data.ajson/?auth_key=",//10
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/RUTA-SERVI-NAVIE-EN-CHILE/data.ajson/?auth_key=",//11
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/LOGIS-PERFO-INDEX/data.ajson/?auth_key=",//12
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/PRINC-SOCIO-COMER-EXPOR/data.ajson/?auth_key=",//13
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/PRINC-SOCIO-COMER-IMPOR/data.ajson/?auth_key=",//14
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/GLOBA-COMPE-INDEX-INFRA/data.ajson/?auth_key=",//15
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/TEST-12708/data.ajson/?auth_key=", //16
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/NUMER-DE-PRODU-EXPOR/data.ajson/?auth_key=", //17
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/TONEL-TERMI-ESTAT-DE-CHILE/data.ajson/?auth_key=", //18
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/CANTI-DE-NAVES-ATRAC/data.ajson/?auth_key=", //19
        "https://api.datos.observatoriologistico.cl/api/v2/datastreams/TRANS-MAXIM-DE-TEUS/data.ajson/?auth_key=" //20
];



// Indicador Acuerdos Comerciales
var loadDataAcuerdosComercialesChile = ((url,apiKey) => {
    d3.json(base + url + apiKey + "&filter0=column2[<=]31/12/"+anio_actual, ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            if (data.result.length > 1 ){
                d3.select("#acuerdos_comerciales").text(data.result.length-1);
                d3.select("#acuerdos_comerciales_fecha_datos").text(anio_actual);
            }else{
                d3.select("#acuerdos_comerciales").text("Sin Información");
            }
        }
    }))
});

///////////////////////////////
//Evolucion Indicadores////////
///////////////////////////////

//Evolución Población de Chile
var loadDataPoblacionChile_Evolucion = ((url,apiKey) => {
    d3.json(base + url + apiKey +"&filter0=column4[<]"+anio_actual+"&groupBy0=column4&function0=SUM[column3]&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            if(data.result.length > 1){
                result = data.result;
                title = result.shift();
                loadChartPoblacion_Evolucion(result);
            }
        }
    }))
});

function loadChartPoblacion_Evolucion(datos){
    let _width_line = $('.evolucion_poblacion').width();
    let _rotation_line = 18;
    let _height = 280;
    let _margin_line = {top: 40, right: $('.evolucion_poblacion').width()*.23, bottom: 50, left: 120}
    let _labelX = -120 - $('.evolucion_poblacion').width()*.03
    let _labelY = 80;
    let _data_unit = "Personas";
    let _decimalTip = 0;
    let min = 1;


    if($(window).width() < 768){
      _margin_line = {top: 55, right: 10, bottom: 50, left: 35}
      _rotation_line = 45;
      _data_unit = "Millones de Personas";
      _decimalTip = 2;
      _labelX = _width_line*.9
      _labelY = 25;
      min = 1000000;
    }

    var ChartLineasPoblacion = d3.cloudshapes.lineChartMtt_v2()
                .width(_width_line)
                .data([datos.map((d)=>{
                    return d[1]/min;
                })])
                .labels(datos.map((d)=>{
                    return d[0];
                }))
                .margin(_margin_line)
                .dataUnit(_data_unit)
                .height(_height)
                .legendX(_labelX)
                .legendY(_labelY)
                .showDropShadow(false)
                .setColor(['#98c9db'])
                .showYaxis(true)
                .labelSize(12)
                .decimalTip(_decimalTip)
                .labelRotation(_rotation_line)
                .multiLine(true)
                .colorsCircles(['#3498DB'])
                .labelTitle(['Población'])
                .showUnitAxis(false)
                ;
    d3.select('#evolucion_poblacion').call(ChartLineasPoblacion);
}// Fin Evolución Población de Chile

//Evolucion Pib
function loadChartPib_Evolucion(datos){
    let _width_line = $('.evolucion_poblacion').width();
    let _rotation_line = 18;
    let _height = 280;
    let _margin_line = {top: 40, right: $('.evolucion_poblacion').width()*.23, bottom: 50, left: 120}
    let _labelX = -120 - $('.evolucion_poblacion').width()*.03
    let _labelY = 80;

    let _data_unit = "Millones";
    let _decimalTip = 0;
    let min = 1000000;

    if($(window).width() < 768){
      _margin_line = {top: 55, right: 10, bottom: 50, left: 60}
      _rotation_line = 45;
      _data_unit = "Millones";
      _decimalTip = 2;
      _labelX = _width_line*.80
      _labelY = 25;
      min = 1000000;
      d3.select("#tab_2_tittle").text("PIB");
    }
    var ChartLineaspib = d3.cloudshapes.lineChartMtt_v2()
                .width(_width_line)
                .data([datos.map((d)=>{
                    return d[1]/min;
                })])
                .labels(datos.map((d)=>{
                    return d[0];
                }))
                .margin(_margin_line)
                .dataUnit(_data_unit)
                .showUnitAxis(false)
                .height(_height)
                .legendX(_labelX)
                .legendY(_labelY)
                .showDropShadow(false)
                .setColor(['#98c9db'])
                .showYaxis(true)
                .labelSize(12)
                .decimalTip(0)
                .labelRotation(_rotation_line)
                .multiLine(true)
                .colorsCircles(['#3498DB'])
                .labelTitle(['Pib'])
                ;
    d3.select('#evolucion_pib').call(ChartLineaspib);
}//Fin Evolucion Pib


//Global Competitiveness Index
countries = {
  Afghanistan: 'AFG',
  Angola: 'AGO',
  Albania: 'ALB',
  UnitedArabEmirates: 'ARE',
  EmiratosArabes: 'ARE',
  Argentina: 'ARG',
  Armenia: 'ARM',
  Antarctica: 'ATA',
  FrenchSouthernandAntarcticLands: 'ATF',
  Australia: 'AUS',
  Austria: 'AUT',
  Azerbaijan: 'AZE',
  Burundi: 'BDI',
  Belgium: 'BEL',
  Blgica: 'BEL',
  Benin: 'BEN',
  BurkinaFaso: 'BFA',
  Bangladesh: 'BGD',
  Bulgaria: 'BGR',
  TheBahamas: 'BHS',
  BosniaandHerzegovina: 'BIH',
  Belarus: 'BLR',
  Belize: 'BLZ',
  Bolivia: 'BOL',
  Brasil: 'BRA',
  Brunei: 'BRN',
  Bhutan: 'BTN',
  Botswana: 'BWA',
  CentralAfricanRepublic: 'CAF',
  Canada: 'CAN',
  Switzerland: 'CHE',
  Chile: 'CHL',
  China: 'CHN',
  IvoryCoast: 'CIV',
  Cameroon: 'CMR',
  DemocraticRepublicoftheCongo: 'COD',
  RepublicoftheCongo: 'COG',
  Congo: 'COG',
  Colombia: 'COL',
  CostaRica: 'CRI',
  Cuba: 'CUB',
  NorthernCyprus: '-99',
  Cyprus: 'CYP',
  Chipre: 'CYP',
  CzechRepublic: 'CZE',
  RepublicaCheca: 'CZE',
  Germany: 'DEU',
  Alemania: 'DEU',
  Djibouti: 'DJI',
  Denmark: 'DNK',
  Dinamarca: 'DNK',
  DominicanRepublic: 'DOM',
  RepDominicana: 'DOM',
  Algeria: 'DZA',
  Argelia: 'DZA',
  Ecuador: 'ECU',
  Egypt: 'EGY',
  Egipto: 'EGY',
  Eritrea: 'ERI',
  Spain: 'ESP',
  Espaa: 'ESP',
  Estonia: 'EST',
  Ethiopia: 'ETH',
  Finland: 'FIN',
  Finlandia: 'FIN',
  Fiji: 'FJI',
  FalklandIslands: 'FLK',
  France: 'FRA',
  Francia: 'FRA',
  FrenchGuiana: 'GUF',
  Gabon: 'GAB',
  UnitedKingdom: 'GBR',
  Inglaterra: 'GBR',
  Georgia: 'GEO',
  Ghana: 'GHA',
  Guinea: 'GIN',
  Gambia: 'GMB',
  GuineaBissau: 'GNB',
  EquatorialGuinea: 'GNQ',
  Greece: 'GRC',
  Grecia: 'GRC',
  Greenland: 'GRL',
  Guatemala: 'GTM',
  Guyana: 'GUY',
  TerHolanenAmrica: 'GUY',
  Honduras: 'HND',
  Croatia: 'HRV',
  Croacia: 'HRV',
  Haiti: 'HTI',
  Hungary: 'HUN',
  Hungra: 'HUN',
  Indonesia: 'IDN',
  India: 'IND',
  Ireland: 'IRL',
  Irlanda: 'IRL',
  Iran: 'IRN',
  Iraq: 'IRQ',
  Malta: 'MLT',
  Iceland: 'ISL',
  Islandia: 'ISL',
  Israel: 'ISR',
  Italy: 'ITA',
  Italia: 'ITA',
  Jamaica: 'JAM',
  Jordan: 'JOR',
  Japan: 'JPN',
  Japn: 'JPN',
  Kazakhstan: 'KAZ',
  Kenya: 'KEN',
  Kyrgyzstan: 'KGZ',
  Cambodia: 'KHM',
  SouthKorea: 'KOR',
  CoreadelSur: 'KOR',
  Kosovo: '-99',
  Kuwait: 'KWT',
  Laos: 'LAO',
  Lebanon: 'LBN',
  Liberia: 'LBR',
  Libya: 'LBY',
  SriLanka: 'LKA',
  Lesotho: 'LSO',
  Lithuania: 'LTU',
  Lituania: 'LTU',
  Luxembourg: 'LUX',
  LuxeMburgo: 'LUX',
  Latvia: 'LVA',
  Letonia: 'LVA',
  Morocco: 'MAR',
  Marruecos: 'MAR',
  Moldova: 'MDA',
  Madagascar: 'MDG',
  Mexico: 'MEX',
  Mxico: 'MEX',
  Macedonia: 'MKD',
  Mali: 'MLI',
  Myanmar: 'MMR',
  Montenegro: 'MNE',
  Mongolia: 'MNG',
  Mozambique: 'MOZ',
  Mauritania: 'MRT',
  Mauricio: 'MRT',
  Malawi: 'MWI',
  Malaysia: 'MYS',
  Malasia: 'MYS',
  Namibia: 'NAM',
  NewCaledonia: 'NCL',
  Niger: 'NER',
  Nigeria: 'NGA',
  Nicaragua: 'NIC',
  Netherlands: 'NLD',
  Holanda: 'NLD',
  Norway: 'NOR',
  Noruega: 'NOR',
  Nepal: 'NPL',
  NewZealand: 'NZL',
  NuevaZelanda: 'NZL',
  Oman: 'OMN',
  Pakistan: 'PAK',
  Panama: 'PAN',
  Peru: 'PER',
  Per: 'PER',
  Philippines: 'PHL',
  Filipinas: 'PHL',
  PapuaNewGuinea: 'PNG',
  Poland: 'POL',
  Polonia: 'POL',
  PuertoRico: 'PRI',
  NorthKorea: 'PRK',
  Portugal: 'PRT',
  Paraguay: 'PRY',
  Qatar: 'QAT',
  Romania: 'ROU',
  Rumania: 'ROU',
  Russia: 'RUS',
  Rusia: 'RUS',
  Rwanda: 'RWA',
  WesternSahara: 'ESH',
  SaudiArabia: 'SAU',
  ArabiaSaudita: 'SAU',
  Sudan: 'SDN',
  SouthSudan: 'SSD',
  Senegal: 'SEN',
  SolomonIslands: 'SLB',
  SierraLeone: 'SLE',
  ElSalvador: 'SLV',
  Somaliland: '-99',
  Somalia: 'SOM',
  RepublicofSerbia: 'SRB',
  Suriname: 'SUR',
  Singapur: 'SGP',
  Slovakia: 'SVK',
  RepEslovaca: 'SVK',
  Slovenia: 'SVN',
  Eslovenia: 'SVN',
  Sweden: 'SWE',
  Suecia: 'SWE',
  Swaziland: 'SWZ',
  Suiza: 'SWZ',
  Syria: 'SYR',
  Siria: 'SYR',
  Chad: 'TCD',
  Togo: 'TGO',
  Thailand: 'THA',
  Thailandia: 'THA',
  Tajikistan: 'TJK',
  Turkmenistan: 'TKM',
  EastTimor: 'TLS',
  TrinidadandTobago: 'TTO',
  TrinidadyTobago: 'TTO',
  Tunisia: 'TUN',
  Tnez: 'TUN',
  Turkey: 'TUR',
  Turqua: 'TUR',
  Taiwan: 'TWN',
  UnitedRepublicofTanzania: 'TZA',
  Uganda: 'UGA',
  Ukraine: 'UKR',
  Ucrania: 'UKR',
  Uruguay: 'URY',
  EstadosUnidos: 'USA',
  Uzbekistan: 'UZB',
  Venezuela: 'VEN',
  Vietnam: 'VNM',
  Vanuatu: 'VUT',
  WestBank: 'PSE',
  Yemen: 'YEM',
  SouthAfrica: 'ZAF',
  Sudafrica: 'ZAF',
  Zambia: 'ZMB',
  Zimbabwe: 'ZWE',
  Zimbadwe: 'ZWE',
  Zimbauwe: 'ZWE'
}
function cleanUpSpecialChars(str) {
  str = str.replace(/[ÀÁÂÃÄÅ]/g, "A");
  str = str.replace(/[àáâãäå]/g, "a");
  str = str.replace(/[ÈÉÊË]/g, "E");
  return str.replace(/[^a-z0-9]/gi, '');
}

var loadDataGlobalCompetitivenessIndex_tab_1 = ((url,apiKey) => {
  d3.json(base + url + apiKey, ((error,data) => {
    if(error){
      return console.log(error);
    }else{
      _data = data;
      x = [];
      result = _data.result;
      title = result.shift();
      result.map((el) => {
        item = {};
        title.map((label,i) => {
          if(label === 'RANKING' || label === 'PUNTAJE'){
            item[label] = Number(el[i].split(',').join(''));
          }else{
            item[label] = el[i];
          }
        })
        x.push(item);
      })
    }
    loadChartsGlobalCompetitivenessIndex(x);
  })).header("Content-Type", "application/x-www-form-urlencoded")
});

var loadChartsGlobalCompetitivenessIndex = ((x) => {
  var _x = x;
  maxYear = 0;
  maxPeriod = '';
  _x.map((d, i) => {
    let auxYear = Number(d.PERÍODO.split('-')[1]);
    if(auxYear > maxYear){
       maxYear = auxYear;
       maxPeriod = d.PERÍODO;
      }
    d['code'] = countries[cleanUpSpecialChars(d.NOMBRE_PAÍS.split(' ').join(''))]
    if (!d['code']) {
      d['code'] = ''
    }
  })

  let reduceAddGlobalCompetitivenessIndex = ((p, v) => {
    ++p.count;
    p.RANKING = v.RANKING;
    p.DIMENSIÓN = v.DIMENSIÓN;
    p.NOMBRE_PAÍS = v.NOMBRE_PAÍS;
    if (maxPeriod === v.PERÍODO){ p.lastPeriod = Number(v.RANKING) }
    p.PUNTAJE += v.PUNTAJE;
    p.sum_puntajes = p.sum_puntajes + v.PUNTAJE;
    p.avr = d3.round(p.sum_puntajes/p.count,2) || 0
    p.PERÍODO = v.PERÍODO;
    p.code = v.code;
    if (v.NOMBRE_PAÍS === 'Chile'){
      p.chile = v.RANKING;
    }
    return p
  });
  let reduceRemoveGlobalCompetitivenessIndex = ((p, v) => {
    --p.count;
    p.RANKING = v.RANKING;
    p.DIMENSIÓN = v.DIMENSIÓN;
    p.NOMBRE_PAÍS = v.NOMBRE_PAÍS;
    if (maxPeriod === v.PERÍODO){ p.lastPeriod = Number(v.RANKING) }
    p.PUNTAJE -= v.PUNTAJE;
    p.sum_puntajes = p.sum_puntajes - v.PUNTAJE;
    p.avr = d3.round(p.sum_puntajes/p.count,2) || 0
    p.PERÍODO = v.PERÍODO;
    p.code = v.code;
    if (v.NOMBRE_PAÍS === 'Chile'){
      p.chile = v.RANKING;
    }
    return p
  });
  let reduceInitialGlobalCompetitivenessIndex = ((p, v) => {
    return {
      count:0,
      count_chile:0,
      RANKING: 0,
      PUNTAJE: 0,
      sum_puntajes:0,
      lastPeriod: '',
      sum_chile:0,
      avr: 0,
      AÑO: '',
      NOMBRE_PAÍS: '',
      code:'',
      avr_puntaje:0,
      chile:0,
      DIMENSIÓN: ''
    }
  });

  var data = crossfilter(_x),
  periodoGloabalCompetitivenessIndexDimension = data.dimension((el) => {
    return el.PERÍODO;
  }),
  paisGloabalCompetitivenessIndexDimension = data.dimension((el) => {
    return el.code;
  }),
  pGloabalCompetitivenessIndexDimension = data.dimension((el) => {
    return el.NOMBRE_PAÍS;
  }),
  dimensionGloabalCompetitivenessIndexDimension = data.dimension((el) => {
    return el.DIMENSIÓN
  }),
  periodoGloabalCompetitivenessIndexGroup = periodoGloabalCompetitivenessIndexDimension.group().reduce(reduceAddGlobalCompetitivenessIndex, reduceRemoveGlobalCompetitivenessIndex,reduceInitialGlobalCompetitivenessIndex),
  paisGloabalCompetitivenessIndexGroup = paisGloabalCompetitivenessIndexDimension.group().reduce(reduceAddGlobalCompetitivenessIndex, reduceRemoveGlobalCompetitivenessIndex,reduceInitialGlobalCompetitivenessIndex),
  dimensionGloabalCompetitivenessIndexGroup = dimensionGloabalCompetitivenessIndexDimension.group().reduce(reduceAddGlobalCompetitivenessIndex, reduceRemoveGlobalCompetitivenessIndex,reduceInitialGlobalCompetitivenessIndex);
  pGloabalCompetitivenessIndexGroup = pGloabalCompetitivenessIndexDimension.group().reduce(reduceAddGlobalCompetitivenessIndex, reduceRemoveGlobalCompetitivenessIndex,reduceInitialGlobalCompetitivenessIndex);




    let width = $(".evolucion_poblacion").width();
    minRankingChile = d3.min(periodoGloabalCompetitivenessIndexGroup.all().map((d) => {
      return d.value.chile - 3
    }));
    maxRankingChile = d3.max(periodoGloabalCompetitivenessIndexGroup.all().map((d) => {
      return d.value.chile + 3
    }));


    let _width_global_competitiveness_index = $('.evolucion_poblacion').width();
    let _margin_global_competitiveness_index ={top: 40, right: $('.evolucion_poblacion').width()*.23, bottom: 50, left: 120}
    let _rotation_global_competitiveness_index = 18;
    let _labelX = -120 - $('.evolucion_poblacion').width()*.03
    let _labelY = 80;

    let _unit = '° Lugar'
    if($(window).width() < 768){
        d3.select("#tab_3_tittle").text("GCI");
        _unit = '°'
        _margin_global_competitiveness_index = {top:55 , right: 0, bottom: 40, left:20 };
        _width_global_competitiveness_index = $('.evolucion_poblacion').width() - 50;
        _labelX = width*.9
        _labelY = 35;
        _rotation_global_competitiveness_index = 30;
    }

    var rankingGloabalCompetitivenessIndexChart =  d3.cloudshapes.lineChartMtt_v2()
        .width(_width_global_competitiveness_index)
        .data([periodoGloabalCompetitivenessIndexGroup.all().map((d,i) => {
          return d.value.chile;
        })])
        .labels(periodoGloabalCompetitivenessIndexGroup.all().map((d,i) => {
          return d.key + "";
        }))
        .margin(_margin_global_competitiveness_index)
        .dataUnit(_unit)
        .height(280)
        .dataTitle('Ranking de Chile')
        .labelTitle(['Ranking de Chile'])
        .showDropShadow(false)
        .setColor(['#98c9db'])
        .showYaxis(true)
        .labelSize(12)
        .labelRotation(_rotation_global_competitiveness_index)
        .multiLine(true)
        .legendX(_labelX)
        .legendY(_labelY)
        .decimalTip(0)
        .domainY([maxRankingChile, minRankingChile])
        .colorsCircles(['#3498DB']);

    d3.select('#evolucion_global').call(rankingGloabalCompetitivenessIndexChart)
});  //Fin Global Competitiveness Index


//Evolucion Liner Shipping Connectivity
var loadDataShipping_Evolucion = ((url,apiKey) => {
    d3.json(base + url + apiKey + "&filter0=column1[==]Chile&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{

            if(data.result.length > 1){
                result = data.result;
                title = result.shift();
                loadChartShipping_Evolucion(result);
            }
        }
    }))
});

function loadChartShipping_Evolucion(datos){
//Indicador Liner Shipping Connectivity
    let max = d3.max(datos.map((d)=>{return Number(d[0]); }))
    max = ""+max;

    for(let i = 0 ; i < datos.length ; i++){
        if(datos[i][0] == max){
            d3.select("#LinerShippingConnectivityIndex_fecha_datos").text(max);
            d3.select("#LinerShippingConnectivityIndex").text(Number(datos[i][3]).toLocaleString('de-DE'));
            break;
        }
    }
//Fin indicador
    let _width_line = $('.evolucion_poblacion').width();
    let _rotation_line = 18;
    let _height = 280;
    let _margin_line = {top: 40, right: $('.evolucion_poblacion').width()*.23, bottom: 50, left: 120}
    let _labelX = -120 - $('.evolucion_poblacion').width()*.03
    let _labelY = 80;


    if($(window).width() < 768){
        d3.select("#tab_4_tittle").text("LSCI");
        _margin_line = {top:55 , right: 0, bottom: 40, left:20 };
        _width_line = $('.evolucion_poblacion').width() - 50;
        _labelX = _width_line*.9
        _labelY = 35;
        _rotation_line = 40;
    }

    var ChartLineasShipping = d3.cloudshapes.lineChartMtt_v2()
                .width(_width_line)
                .data([datos.map((d)=>{
                    return Number(d[3]);
                })])
                .labels(datos.map((d)=>{
                    return d[0];
                }))
                .margin(_margin_line)
                // .dataUnit('')
                .height(_height)
                .legendX(_labelX)
                .legendY(_labelY)
                .showDropShadow(false)
                .setColor(['#98c9db'])
                .showYaxis(true)
                .labelSize(12)
                .decimalTip(2)
                .labelRotation(_rotation_line)
                .multiLine(true)
                .colorsCircles(['#3498DB'])
                .labelTitle(['Índice'])
                ;
    d3.select('#evolucion_shipping').call(ChartLineasShipping);
}// Fin Evolucion Liner Shipping Connectivity

//Evolucion Logistics Performance Index
var loadDataLogisticsPerformanceIndex_ev = ((url,apiKey) => {
      d3.json(base + url + apiKey, ((error,data) => {
        if(error){
          return console.log(error);
        }else{
          _data = data;
          x = [];
          result = _data.result;
          title = result.shift();
          result.map((el) => {
            item = {};
            title.map((label,i) => {
              if(label === 'PUNTAJE' || label === 'RANKING'){
                item[label] = Number(el[i].split(',').join('')) || 0;
              }else{
                item[label] = el[i];
              }
            })
            x.push(item);
          })
        }
        loadChartsLogisticsPerformanceIndex(x);
      }))
});

var loadChartsLogisticsPerformanceIndex = ((x) => {
      var _x = x;
      var xData = [];
      let ocde = ["Chile"];
      let reduceAddLogisticsPerformanceIndex = ((p, v) => {
        ++p.count;
        p.NOMBRE_PAÍS = v.NOMBRE_PAÍS;
        p.AÑO = v.AÑO;
        p.CÓDIGO_PAÍS = v.CÓDIGO_PAÍS;
        p.DIMENSIÓN = v.DIMENSIÓN;
        p.RANKING = v.RANKING;
        switch(v.NOMBRE_PAÍS){
          case ocde[0]:
          p.chile = v.RANKING;
          break;
        }
        p.sum = p.sum + v.PUNTAJE;
        p.avr = d3.round(p.sum/p.count,2) || 0;
        return p
      });
      let reduceRemoveLogisticsPerformanceIndex = ((p, v) => {
        --p.count;
        p.NOMBRE_PAÍS = v.NOMBRE_PAÍS;
        p.AÑO = v.AÑO;
        p.CÓDIGO_PAÍS = v.CÓDIGO_PAÍS;
        p.DIMENSIÓN = v.DIMENSIÓN;
        p.RANKING = v.RANKING;
        switch(v.NOMBRE_PAÍS){
            case ocde[0]:
            p.chile = v.RANKING;
            break;
        }
        p.sum = p.sum - v.PUNTAJE;
        p.avr = d3.round(p.sum/p.count,2) || 0;
        return p
      });
      let reduceInitialLogisticsPerformanceIndex = ((p, v) => {
        return {
          count: 0,
          NOMBRE_PAÍS: '',
          CÓDIGO_PAÍS: '',
          AÑO: '',
          DIMENSIÓN: '',
          PUNTAJE: 0,
          RANKING: 0,
          avr: 0,
          sum:0,
          chile:0,
        }
      });

      var data = crossfilter(_x),
      rankingLogisticsPerformanceIndexDimension = data.dimension((el) => {
        return el.AÑO;
      }),
      dimensionLogisticsPerformanceIndexDimension = data.dimension((el) => {
        return el.DIMENSIÓN;
      }),
      rankingLogisticsPerformanceIndexGroup = rankingLogisticsPerformanceIndexDimension.group().reduce(reduceAddLogisticsPerformanceIndex,reduceRemoveLogisticsPerformanceIndex,reduceInitialLogisticsPerformanceIndex),
      dimensionLogisticsPerformanceIndexGroup = dimensionLogisticsPerformanceIndexDimension.group().reduce(reduceAddLogisticsPerformanceIndex,reduceRemoveLogisticsPerformanceIndex,reduceInitialLogisticsPerformanceIndex);
      let dimensionFilterInit = ['LPI'];
      dimensionLogisticsPerformanceIndexDimension.filterFunction((d) => {
        return dimensionFilterInit.indexOf(d) != -1;
      })

      let i = 0;
      let rankingOcde = [];
        let chile = [];
        _x.map((d) => {
          if (d.DIMENSIÓN === 'LPI'){
            switch(d.NOMBRE_PAÍS){
              case 'Chile':
              chile.push(d.RANKING)
              break;
            }
          }
        })
      rankingOcde = [chile.reverse()]
      let width = $('.evolucion_poblacion').width()
      let _margin_logistics_performace = {top: 40, right: $('.evolucion_poblacion').width()*.23, bottom: 50, left: 120}
      let _width_logistics_performace = $('.evolucion_poblacion').width();
      let _labelX = -120 - $('.evolucion_poblacion').width()*.03
      let _labelY = 80;
      let _unit = '° lugar'
      if($(window).width() < 768){
          d3.select("#tab_5_tittle").text("LPI");
          _unit = '°'
          _margin_logistics_performace = {top: 45, right: 0, bottom: 50, left: 20}
          _width_logistics_performace = $('.evolucion_poblacion').width() - 40;
          _labelX = width*.9
          _labelY = 25;
      }
      let domain = [d3.max(rankingOcde[0])+3, d3.min(rankingOcde[0])-5]
      dimensionLogisticsPerformanceIndexChart = d3.cloudshapes.lineChartMtt_v2()
          .width(_width_logistics_performace)
          .data(rankingOcde)
          .labels(rankingLogisticsPerformanceIndexGroup.all().map((d,i) => {
            return d.key + "";
          }))
          .margin(_margin_logistics_performace)
          .dataUnit(_unit)
          .height(280)
          .showDropShadow(false)
          .setColor(['#98c9db'])
          .showYaxis(true)
          .labelSize(12)
          .labelRotation(18)
          .multiLine(true)
          .decimalTip(0)
          .labelTitle(['Ranking de Chile'])
          .legendY(_labelY)
          .legendX(_labelX)
          .domainY(domain)
          .colorsCircles(['#3498DB']);

      d3.select('#evolucion_logistcs').call(dimensionLogisticsPerformanceIndexChart);
});// Fin Evolucion Logistics Performance Index


// Evolucion Global Competitiveness Index Infraestructura
var loadDataGlobalCompetitivenessIndexInfraestructura = ((url,apiKey) => {

      d3.json(base + url + apiKey, ((error,data) => {
        if(error){
          return console.log(error);
        }else{
          _data = data;
          x = [];
          result = _data.result;
          title = result.shift();
          result.map((el) => {
            item = {};
            title.map((label,i) => {
              if(label === 'RANKING' || label === 'PUNTAJE'){
                item[label] = Number(el[i].split(',').join('')) || 0;
              }else{
                item[label] = el[i];
              }
            })
            x.push(item);
          })
        }
        loadChartsGlobalCompetitivenessIndexInfraestructura(x);
      }))
    });

var loadChartsGlobalCompetitivenessIndexInfraestructura = ((x) => {
      var _x = x;
      var xData =[];
      var maxYear = 0;
      let lastPeriod = ''
      _x.map((d, i) => {
        let aux = Number(d.PERÍODO.split('-')[1]);
        if (maxYear < aux ){
          maxYear = aux;
          lastPeriod = d.PERÍODO;
        }
        if(d.DIMENSIÓN != 'Calidad de la infraestructura ferroviaria' && d.DIMENSIÓN != 'Infraestructura de transporte'){
          d['code'] = countries[cleanUpSpecialChars(d.NOMBRE_PAÍS.split(' ').join(''))]
          if (!d['code']) {
            d['code'] = ''
          }
          xData.push(d);
        }
      })

      let reduceAddGlobalCompetitivenessIndexInfraestructura = ((p, v) => {
        ++p.count;

        p.RANKING = v.RANKING;
        p.DIMENSIÓN = v.DIMENSIÓN;
        p.NOMBRE_PAÍS = v.NOMBRE_PAÍS;
        p.PUNTAJE += v.PUNTAJE;
        if (lastPeriod.toString() === v.PERÍODO){
          p.lastYear = v.RANKING
        }
        p.sum_puntajes = p.sum_puntajes + v.PUNTAJE;
        p.avr = d3.round(p.sum_puntajes/p.count,2) || 0
        p.PERÍODO = v.PERÍODO;
        p.code = v.code;
        if (v.NOMBRE_PAÍS === 'Chile'){

          p.chile = p.chile + v.RANKING;
        }
        return p
      });
      let reduceRemoveGlobalCompetitivenessIndexInfraestructura = ((p, v) => {
        --p.count;

        p.RANKING = v.RANKING;
        p.DIMENSIÓN = v.DIMENSIÓN;
        p.NOMBRE_PAÍS = v.NOMBRE_PAÍS;
        p.PUNTAJE -= v.PUNTAJE;
        if (maxYear.toString() === v.AÑO){
          p.lastYear = v.RANKING
        }
        p.sum_puntajes = p.sum_puntajes - v.PUNTAJE;
        p.avr = d3.round(p.sum_puntajes/p.count,2) || 0
        p.PERÍODO = v.PERÍODO;
        p.code = v.code;
        if (v.NOMBRE_PAÍS === 'Chile'){
          p.chile = p.chile - v.RANKING;
        }
        return p
      });
      let reduceInitialGlobalCompetitivenessIndexInfraestructura = ((p, v) => {
        return {
          count:0,
          count_chile:0,
          RANKING: 0,
          PUNTAJE: 0,
          sum_puntajes:0,
          lastYear: 0,
          sum_chile:0,
          avr: 0,
          AÑO: '',
          NOMBRE_PAÍS: '',
          code:'',
          avr_puntaje:0,
          chile:0,
          DIMENSIÓN: ''
        }
      });

      var data = crossfilter(xData),
      periodoGloabalCompetitivenessIndexInfraestructuraDimension = data.dimension((el) => {
        return el.PERÍODO;
      }),
      paisGloabalCompetitivenessIndexInfraestructuraDimension = data.dimension((el) => {
        return el.code;
      }),
      dimensionGloabalCompetitivenessIndexInfreaestructuraDimension = data.dimension((el) => {
        return el.DIMENSIÓN
      }),
      periodoGloabalCompetitivenessIndexInfraestructuraGroup = periodoGloabalCompetitivenessIndexInfraestructuraDimension.group().reduce(reduceAddGlobalCompetitivenessIndexInfraestructura, reduceRemoveGlobalCompetitivenessIndexInfraestructura,reduceInitialGlobalCompetitivenessIndexInfraestructura),
      paisGloabalCompetitivenessIndexInfraestructuraGroup = paisGloabalCompetitivenessIndexInfraestructuraDimension.group().reduce(reduceAddGlobalCompetitivenessIndexInfraestructura, reduceRemoveGlobalCompetitivenessIndexInfraestructura,reduceInitialGlobalCompetitivenessIndexInfraestructura),
      dimensionGloabalCompetitivenessIndexInfraestructuraGroup = dimensionGloabalCompetitivenessIndexInfreaestructuraDimension.group().reduce(reduceAddGlobalCompetitivenessIndexInfraestructura, reduceRemoveGlobalCompetitivenessIndexInfraestructura,reduceInitialGlobalCompetitivenessIndexInfraestructura);


      let dimensionFilterInit = ['Calidad de la infraestructura portuaria'];
      dimensionGloabalCompetitivenessIndexInfreaestructuraDimension.filterFunction((d) => {
        return dimensionFilterInit.indexOf(d) != -1;
      })
      let minRankingChile = d3.min(periodoGloabalCompetitivenessIndexInfraestructuraGroup.all().map((d) => {
        return d.value.chile - 3
      }));
      let maxRankingChile = d3.max(periodoGloabalCompetitivenessIndexInfraestructuraGroup.all().map((d) => {
        return d.value.chile + 3
      }));

      let _width_competitiveness_index_infraestructura = $('.evolucion_poblacion').width();

      let _margin_competitiveness_index_infraestructura = {top: 40, right: $('.evolucion_poblacion').width()*.23, bottom: 50, left: 120}
      let _rotation_competitiveness_index_infraestructura = 18;
      let _labelX = -120 - $('.evolucion_poblacion').width()*.03
      let _labelY = 80;
      let _unit = '° Lugar';

      if($(window).width() < 768){
          d3.select("#tab_6_tittle").text("GCI Infraestructura Portuaria");
          _unit = '°'
          _margin_competitiveness_index_infraestructura = {top:55 , right: 0, bottom: 40, left:20 };
          _width_competitiveness_index_infraestructura = $('.evolucion_poblacion').width() - 50;
          _labelX = $('.evolucion_poblacion').width()*.9
          _labelY = 35;
          _rotation_competitiveness_index_infraestructura = 30;

      }
     //Indicador
    let ultimo_periodo = d3.max(periodoGloabalCompetitivenessIndexInfraestructuraGroup.all().map((d)=>{
         return Number(d.key.slice(-4));
     }));
     let periodo_indicador = "" + (ultimo_periodo-1) + "-" + ultimo_periodo;
     d3.select("#Calidad_Infraestructura_Portuaria_fecha_dato").text(periodo_indicador);

     for(let i = 0; i < periodoGloabalCompetitivenessIndexInfraestructuraGroup.all().length; i++ ){
         if(periodo_indicador == periodoGloabalCompetitivenessIndexInfraestructuraGroup.all()[i].key){
             d3.select("#Calidad_Infraestructura_Portuaria").text(periodoGloabalCompetitivenessIndexInfraestructuraGroup.all()[i].value.chile+"º");
             break;
         }
     }
     //Fin Indicador

      var rankingGloabalCompetitivenessIndexInfraestructuraChart =  d3.cloudshapes.lineChartMtt_v2()
              .width(_width_competitiveness_index_infraestructura)
              .data([periodoGloabalCompetitivenessIndexInfraestructuraGroup.all().map((d,i) => {

                return d.value.chile;

              })])
              .labels(periodoGloabalCompetitivenessIndexInfraestructuraGroup.all().map((d,i) => {
                return d.key + "";
              }))
              .margin(_margin_competitiveness_index_infraestructura)
              .dataUnit(_unit)
              .height(280)
              .dataTitle('Ranking de Chile')
              .labelTitle(['Ranking de Chile'])
              .showDropShadow(false)
              .setColor(['#98c9db'])
              .showYaxis(true)
              .showTitle(false)
              .textTitle('Ranking de Chile')
              .classTitle('title-ranking')
              .labelSize(12)
              .labelRotation(_rotation_competitiveness_index_infraestructura)
              .multiLine(true)
              .decimalTip(0)
              .legendX(_labelX)
              .legendY(_labelY)
              .domainY([maxRankingChile, minRankingChile])
              .colorsCircles(['#3498DB']);
      d3.select('#lineas_grahp_3').call(rankingGloabalCompetitivenessIndexInfraestructuraChart);
});// Fin Evolucion Global Competitiveness Index Infraestructura

/////////////////////////////////////
////// Datos Comercio Exterior //////
/////////////////////////////////////

// Inicio Número de Productos
var loadDataNumeroProductosExportados = ((url,apiKey) => {
    d3.json(base + url + apiKey + "&filter0=column0[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            _data = data;
            x = [];
            result = _data.result;
            title = result.shift();
            result.map((el) => {
                item = {};
                title.map((label,i) => {
                    item[label] = el[i];
                })
                x.push(item);
            })
            loadDataNumeroProductosImportados("https://api.datos.observatoriologistico.cl/api/v2/datastreams/NUMER-DE-PRODU-IMPOR/data.ajson/?auth_key=",key,x);
        }
    }))
});

function loadDataNumeroProductosImportados(url,apiKey,data_exp){

    d3.json(base + url + apiKey + "&filter0=column0[<=]"+(anio_actual)+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{

            _data = data;
            x = [];
            result = _data.result;
            title = result.shift();
            result.map((el) => {
                item = {};
                title.map((label,i) => {
                    item[label] = el[i];
                })
                x.push(item);
            })

            loadChartNumeroProductos(data_exp,x);
        }
    }));
}
function loadChartNumeroProductos(exp,imp){

    let cross_Numero_Productos_exp = crossfilter(exp);
    let cross_Numero_Productos_imp = crossfilter(imp);

    let Add = ((p, v) => {
        ++p.count;
        p.Año = v.Año;
        p.Unidad = v.Unidad;
        p.Valor += v.Valor;
        return p;
    });
    let Remove = ((p, v) => {
        --p.count;
        p.Año = v.Año;
        p.Unidad = v.Unidad;
        p.Valor -= v.Valor;
        return p;
    });
    let Initial = ((p, v) => {
        return {
            Año: '',
            Unidad: '',
            Valor:0,
            count:0
        }
    });

    let dim_año_exp = cross_Numero_Productos_exp.dimension((d)=>{ return d.Año;}),
        dim_año_imp = cross_Numero_Productos_imp.dimension((d)=>{ return d.Año;});

    let group_Exportacion = dim_año_exp.group().reduce(Add, Remove, Initial),
        group_Importacion = dim_año_imp.group().reduce(Add, Remove, Initial);

    let año_mostrar_ind_exp = 0, año_mostrar_ind_imp = 0, año_mostrar = 0;
    for(let i = 0; i < group_Exportacion.all().length ; i++){
        for(let k = 0; k < group_Importacion.all().length ; k++){
            if( group_Exportacion.all()[i].key == group_Importacion.all()[k].key){
                if ( Number(group_Exportacion.all()[i].key) > año_mostrar ){
                    año_mostrar = Number(group_Exportacion.all()[i].key);
                    año_mostrar_ind_exp = i;
                    año_mostrar_ind_imp = k;
                }
            }
        }
    }

    año_mostrar = String(año_mostrar);

    document.getElementById("titulo_donut_numero_productos").innerHTML = 'Número de productos '+ año_mostrar;
    let _width_burbujas = $('.donut_numero_productos_cl').width();
    let _height = 200;
    let donut_1 = d3.cloudshapes.donutChartMtt_v2()
                .width(_width_burbujas)
                .data([group_Exportacion.all()[año_mostrar_ind_exp].value.Valor,group_Importacion.all()[año_mostrar_ind_imp].value.Valor])
                .labels(['Exportación','Importación'])
                .dataUnit("Número de productos")
                .showLegend(false)
                .showLabel(true)
                .innRadius(45)
                .outRadius(80)
                .height(_height)
                .strokeColor('#ffffff')
                .mouseStrokeOverColor('#ffffff')
                .showNumber(true)
                .decimalTip(1)
                .margin({top: 10, right: 10, bottom: 10, left: 10})
                .colors(['#3498DB', '#F18C3E'])
                .selectable(false)
                ;
    d3.select('#donut_numero_productos').call(donut_1);

}
// Fin Número de Productos

//Inicio Productos Exportados Importados
//Produtos Mineros Exportados
var loadDataProductosExpImp_d1 = ((url,apiKey) => {
    d3.json(base + url + apiKey + "&filter0=column4[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            _data = data;
            x = [];
            result = _data.result;
            title = result.shift(); // ["Familia", "Productos", "Valor", "Unidad", "Año"]
            result.map((el) => {
                item = {};
                title.map((label,i) => {
                    item[label] = el[i];
                })
                x.push(item);
            })

            loadDataProductosExpImp_d2("https://api.datos.observatoriologistico.cl/api/v2/datastreams/PRINC-PRODU-NO-MINER-EXPOR/data.ajson/?auth_key=",key,x);
        }
    }))
});
//Produtos No Mineros Exportados
var loadDataProductosExpImp_d2 = ((url,apiKey,datos_exp) => {
    d3.json(base + url + apiKey + "&filter0=column3[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            _data = data;
            result = _data.result;
            title = result.shift(); // ["Familia", "Productos", "Valor", "Año", "Unidad"]
            result.map((el) => {
                item = {};
                title.map((label,i) => {
                    item[label] = el[i];
                })
                datos_exp.push(item);
            })
            loadDataProductosExpImp_d3("https://api.datos.observatoriologistico.cl/api/v2/datastreams/PRINC-PRODU-COMBU-IMPOR/data.ajson/?auth_key=",key,datos_exp)
        }
    }))
});
//Produtos Combustibles Importados
var loadDataProductosExpImp_d3 = ((url,apiKey,datos_exp) => {
    d3.json(base + url + apiKey + "&filter0=column2[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            _data = data;
            x = [];
            result = _data.result;
            title = result.shift(); // ["Familia", "Productos", "Año", "Valor", "Unidad"]
            result.map((el) => {
                item = {};
                title.map((label,i) => {
                    item[label] = el[i];
                })
                x.push(item);
            })

            loadDataProductosExpImp_d4("https://api.datos.observatoriologistico.cl/api/v2/datastreams/PRINC-PRODU-NO-COMBU-IMPOR/data.ajson/?auth_key=",key,datos_exp,x);

        }
    }))
});
//Produtos No Combustibles Importados
var loadDataProductosExpImp_d4 = ((url,apiKey,datos_exp,datos_imp) => {
    d3.json(base + url + apiKey + "&filter0=column2[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{

            _data = data;
            result = _data.result;
            title = result.shift(); // ["Familia", "Productos", "Valor", "Año", "Unidad"]
            result.map((el) => {
                item = {};
                title.map((label,i) => {
                    item[label] = el[i];
                })
                datos_imp.push(item);
            })
            loadDataProductosExpImp_d5_pib("https://api.datos.observatoriologistico.cl/api/v2/datastreams/PIB-DE-CHILE-EN-88440/data.ajson/?auth_key=",key,datos_exp,datos_imp);
        }
    }))
});

var loadDataProductosExpImp_d5_pib = ((url,apiKey,datos_exp,datos_imp) => {
    d3.json(base + url + apiKey +"&filter0=column0[<=]"+anio_actual+"&filter1=column0[>=]2002&where=(filter0 and filter1)&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            _data = data;
            x = [];
            result = _data.result;
            title = result.shift();
            result.map((el) => {
                item = {};
                title.map((label,i) => {
                    item[label] = el[i];
                })
                x.push(item);
            })
            loadChartPib_Evolucion(result);
            loadChartProductosExpImp(datos_exp,datos_imp,x);
        }
    }))
});

// Graficos Donut Cantidad de productos y Treemaps de productos importados y exportados
function loadChartProductosExpImp(datos_exp,datos_imp,datos_pib){
    let cross_exp = crossfilter(datos_exp);
    let cross_imp = crossfilter(datos_imp);

    let Add = ((p, v) => {
        ++p.count;
        p.Año = v.Año;
        p.Unidad = v.Unidad;
        p.Valor += v.Valor;
        return p;
    });
    let Remove = ((p, v) => {
        --p.count;
        p.Año = v.Año;
        p.Unidad = v.Unidad;
        p.Valor -= v.Valor;
        return p;
    });
    let Initial = ((p, v) => {
        return {
            Año: '',
            Unidad: '',
            Valor:0,
            count:0
        }
    });

    let dim_año_exp = cross_exp.dimension((d)=>{return d.Año;}),
        dim_año_imp = cross_imp.dimension((d)=>{return d.Año;});

    let group_Exportacion = dim_año_exp.group().reduce(Add, Remove, Initial),
        group_Importacion = dim_año_imp.group().reduce(Add, Remove, Initial);


    let año_mostrar_ind_exp = 0, año_mostrar_ind_imp = 0, año_mostrar = 0, pib = 1;
    for(let i = 0; i < group_Exportacion.all().length ; i++){
        for(let k = 0; k < group_Importacion.all().length ; k++){
            if( group_Exportacion.all()[i].key == group_Importacion.all()[k].key){
                for(let j = 0; j < datos_pib.length ; j++){
                    if(datos_pib[j]["Año"] == group_Exportacion.all()[i].key ){
                        if ( Number(group_Exportacion.all()[i].key) > año_mostrar ){
                            año_mostrar = Number(group_Exportacion.all()[i].key);
                            año_mostrar_ind_exp = i;
                            año_mostrar_ind_imp = k;
                            pib = datos_pib[j]["PIB Precios Corrientes"];
                        }
                        break;
                    }
                }
            }
        }
    }

    document.getElementById("titulo_donut_millones").innerHTML = 'Millones US$ '+año_mostrar;

    let pib_exp = (group_Exportacion.all()[año_mostrar_ind_exp].value.Valor*1000000)/pib,
        pib_imp = (group_Importacion.all()[año_mostrar_ind_imp].value.Valor*1000000)/pib;

    let _width_burbujas = $('.donut_millones_cl').width(),
        _height = 200;

    let donut_2 = d3.cloudshapes.donutChartMtt_v2()
                .width(_width_burbujas)
                .data([Math.round(group_Exportacion.all()[año_mostrar_ind_exp].value.Valor),Math.round(group_Importacion.all()[año_mostrar_ind_imp].value.Valor)])
                .dataUnit("Millones de US$ FOB")
                .labels(['Exportación','Importación'])
                .showLegend(false)
                .showLabel(true)
                .innRadius(45)
                .outRadius(80)
                .height(_height)
                .strokeColor('#ffffff')
                .mouseStrokeOverColor('#ffffff')
                .showNumber(true)
                .decimalTip(1)

                .extraInfoTip(["Proporción Pib: "+d3.round((pib_exp*100),1).toLocaleString('de-DE')+" %","Proporción Pib: "+d3.round((pib_imp*100),1).toLocaleString('de-DE')+" %"])
                .margin({top: 10, right: 10, bottom: 10, left: 10})
                .colors(['#3498DB', '#F18C3E'])
                .selectable(false)
                ;
    d3.select('#donut_millones').call(donut_2);

    let datos_treemap_exp = [];
    for( let i  = 0; i < datos_exp.length ; i++){
        if(datos_exp[i].Año == año_mostrar){
            item = {"valor":0,"name":"","group":""};
            item.group = datos_exp[i].Familia;
            item.name = datos_exp[i].Productos;
            item.valor = datos_exp[i].Valor;
            datos_treemap_exp.push(item);
        }
    }
    document.getElementById("titulo_treemap_exportados").innerHTML = 'Productos exportados por categoría ' + año_mostrar;
    let maxForks_v1 = d3.max(datos_treemap_exp, function(d){ return d.valor; });
    let background_v1 = d3.scale.linear().domain([0, maxForks_v1]).range(["#BDE1FF", "#397EFE"]);

    let vis_productos_exportados = d3plus.viz()
        .height(300)
        .format("es_ES")
        .container("#cajas_1")
        .data(datos_treemap_exp)
        .type("tree_map")
        .id(["group","name"])
        .size("valor")
        .color((d)=>{
            return background_v1(d.valor);
        })
        .format({ "number" : function( number , key ) {
            if (key.key == "share") return  Math.round(number).toLocaleString('de-DE') +"%";
            return Math.round(number).toLocaleString('de-DE') +" Mill. US$ FOB";
        }})
        .legend(false)
        .draw();



    let datos_treemap_imp = [];
    for( let i  = 0; i < datos_imp.length ; i++){
        if(datos_imp[i].Año == año_mostrar){
            item = {"valor":0,"name":"","group":""};
            item.group = datos_imp[i].Familia;
            item.name = datos_imp[i].Productos;
            item.valor = datos_imp[i].Valor;
            datos_treemap_imp.push(item);
        }
    }

    document.getElementById("titulo_treemap_importados").innerHTML = 'Productos importados por categoría ' + año_mostrar;
    let maxForks_v2 = d3.max(datos_treemap_imp, function(d){ return d.valor; });
    let background_v2 = d3.scale.linear().domain([0, maxForks_v2]).range(["#FFC557", "#FF8820"]);

    let vis_productos_importados = d3plus.viz()
        .height(300)
        .format("es_ES")
        .container("#cajas_2")
        .data(datos_treemap_imp)
        .type("tree_map")
        .id(["group","name"])
        .size("valor")
        .color((d)=>{
            return background_v2(d.valor);
        })
        .format({ "number" : function( number , key ) {
            if (key.key == "share") return  Math.round(number).toLocaleString('de-DE') +"%";
            return Math.round(number).toLocaleString('de-DE') +" Mill. US$ CIF";
        }})
        .legend(false)
        .draw();

}
//Fin Productos Exportados Importados

//Inicio donut Toneladas
function loadChartBurbuja4(total_exportaciones,total_importaciones,año){

    document.getElementById("titulo_burbuja4").innerHTML = 'Toneladas '+año;
    let _width_burbujas = $('.burbuja_4_cl').width();
    let _height = 200;

    let donut_4 = d3.cloudshapes.donutChartMtt_v2()
                .width(_width_burbujas)
                .data([total_exportaciones,total_importaciones])
                .dataUnit("Toneladas")
                .labels(['Exportación','Importación'])
                .showLegend(false)
                .showLabel(true)
                .innRadius(45)
                .outRadius(80)
                .height(_height)
                .strokeColor('#ffffff')
                .mouseStrokeOverColor('#ffffff')
                .showNumber(true)
                .decimalTip(1)
                // .margin({top: 20, right: 40, bottom: 20, left: 5})
                .margin({top: 10, right: 10, bottom: 10, left: 10})
                .colors(['#3498DB', '#F18C3E'])
                .selectable(false)
                ;
    d3.select('#burbuja_4').call(donut_4);
}
//Fin donut Toneladas


///////////////////////////////////////
///  Treemaps Socios Comerciales   ////
///////////////////////////////////////

// Inicio Socios Comerciales Exportacion
var loadSociosComercialesExportacion = (url,apiKey,anio) => {
    d3.json(base + url + apiKey + "&filter0=column3[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            _data = data;
            x = [];
            result = _data.result;
            title = result.shift();
            result.map((el) => {
                item = {};
                title.map((label,i) => {
                    item[label] = el[i];
                })
                x.push(item);
            })

            loadChartSociosComercialesExportacion(x);

        }
    }))
}


function loadChartSociosComercialesExportacion(datos_socios_exp){
    let max = d3.max(datos_socios_exp, function(d){ return Number(d.Año); });

    let datos_treemap_exp = [];
    max = String(max);

    for( let i  = 0; i < datos_socios_exp.length ; i++){
        if(datos_socios_exp[i].Año == max){
            item = {"valor":0,"name":"","group":""};
            item.group = datos_socios_exp[i].Continente;
            item.name = datos_socios_exp[i].País;
            item.valor = datos_socios_exp[i].Valor;
            datos_treemap_exp.push(item);
        }
    }

    document.getElementById("titulo_socios_exportacion").innerHTML = 'Principales Socios Comerciales Exportación ' + max;
    let maxForks = d3.max(datos_treemap_exp, function(d){ return d.valor; });
    let background = d3.scale.linear().domain([0, maxForks]).range(["#BDE1FF", "#397EFE"]);
    let visualization = d3plus.viz()
        .height(300)
        .format("es_ES")
        .container("#cajas_socios_exp")
        .data(datos_treemap_exp)
        .type("tree_map")
        .id(["group","name"])
        .size("valor")
        .color((d)=>{
            return background(d.valor);
        })
        .format({ "number" : function( number , key ) {
            if (key.key == "share") return  Math.round(number).toLocaleString('de-DE') +"%";
            return Math.round(number).toLocaleString('de-DE') +" Mill. US$ FOB";
        }})
        .legend(false)
        .draw();
}
// Fin Socios Comerciales Exportacion

// Inicio Socios Comerciales Importacion
var loadSociosComercialesImportacion = (url,apiKey) => {
    d3.json(base + url + apiKey + "&filter0=column3[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            _data = data;
            x = [];
            result = _data.result;
            title = result.shift();
            result.map((el) => {
                item = {};
                title.map((label,i) => {
                    item[label] = el[i];
                })
                x.push(item);
            })
            loadChartSociosComercialesImportacion(x);
        }
    }))
}

function loadChartSociosComercialesImportacion(datos){

        let max = d3.max(datos, function(d){ return Number(d.Año); });
        max = String(max);
        let datos_treemap_imp = [];
        for( let i  = 0; i < datos.length ; i++){
            if(datos[i].Año == max){
                item = {"valor":0,"name":"","group":""};
                item.group = datos[i].Continente;
                item.name = datos[i].País;
                item.valor = datos[i].Valor;
                datos_treemap_imp.push(item);
            }
        }
        document.getElementById("titulo_socios_importacion").innerHTML = 'Principales Socios Comerciales Importación '+max;
        var maxForks = d3.max(datos_treemap_imp, function(d){ return d.valor; });
        var background = d3.scale.linear().domain([0, maxForks]).range(["#FFC557", "#FF8820"]);
        var visualization = d3plus.viz()
            .height(300)
            .format("es_ES")
            .container("#burbuja_socios_importaciones")
            .data(datos_treemap_imp)
            .type("tree_map")
            .id(["group","name"])
            .size("valor")
            .color((d)=>{
                return background(d.valor);
            })
            .format({ "number" : function( number , key ) {
                if (key.key == "share") return  Math.round(number).toLocaleString('de-DE') +"%";
                return Math.round(number).toLocaleString('de-DE') +" Mill. US$ CIF";
            }})
            .legend(false)
            .draw();
};// Fin Socios Comerciales Importacion

///////////////////////////////////////
//////////  Relacion de datos   ///////
///////////////////////////////////////

var first_serv;
// Inicio Carga de lista de servicios y Agregado de datos en Tabla y Lista Desplegable de Servicios
var loadListaServicios = ((url,apiKey) => {

    d3.json(base + url + apiKey, ((error,data) => {
        if(error){

        }else{
            if(data.result.length > 1){
                let flag = true;
                result = data.result;
                title = result.shift();
                lista = d3.select("#lista_servicios");

                result.map((d)=>{
                    tr = lista.append("tr");
                    tr.append("td").attr("class","text-center").text(d[0]);
                    tr.append("td").attr("class","text-center").text(Number(d[5]).toLocaleString('de-DE'));
                    tr.append("td").attr("class","text-center").text(Number(d[3]).toLocaleString('de-DE'));
                    tr.append("td").attr("class","text-center").text(Number(d[4]).toLocaleString('de-DE'));
                    if (typeof(datos_servicios[d[0]]) == "undefined"){
                        datos_servicios[d[0]] =   {
                                            nombre_servicio:d[0],
                                            cant_naves:Number(d[5]),
                                            cant_teus: Number(d[3]),
                                            frecuencia:Number(d[4])
                                        };
                    }
                let txt = '<option value="'+d[0]+'">'+d[0]+'</option>'
                $("#filtro_servicios").append(txt);
                if(flag){
                    first_serv = d[0];
                    flag = false;
                }
                });

                cambio_filtro_servicio(true,first_serv);
            }

        }
    }))
});// Fin Carga de lista de servicios

//Inicio Carga de Rutas de servicio
var loadRutasServicios = ((url,apiKey) => {

    d3.json(base + url + apiKey, ((error,data) => {
        if(error){

        }else{
            if(data.result.length > 1){

                data_ord = {};
                result = data.result;
                title = result.shift();
                result.map((d)=>{
                    if (typeof(data_ord[d[0]]) == "undefined"){
                        data_ord[d[0]] =   {
                                            puerto_name:d[0],
                                            ruta: []
                                        };
                    }
                    data_ord[d[0]].ruta[d[2]] = {name:d[1],lat:d[3],lon:d[4]};
                });

                rutas = data_ord;
                loadListaServicios("https://api.datos.observatoriologistico.cl/api/v2/datastreams/SERVI-NAVIE-EN-CHILE/data.ajson/?auth_key=",key);

            }else{

            }

        }
    }))
});
//Fin Carga de Rutas de servicio

//Inicio Carga de Lista de Puertos
var loadListaPuertos = ((url,apiKey) => {
    d3.json(base + url + apiKey +"&groupBy0=column0&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            if(data.result.length > 1){
                result = data.result;
                result.shift();

                loadRelacionPuertoServicio("https://api.datos.observatoriologistico.cl/api/v2/datastreams/RUTA-SERVI-NAVIE-EN-CHILE/data.ajson/?auth_key=",key,result)
            }else{

            }

        }
    }))
});
//Fin Carga de Lista de Puertos

//Inicio Relacion entre Puertos y Servicios
function loadRelacionPuertoServicio(url,apiKey,puertos){
    d3.json(base + url + apiKey, ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            data_relacion = {};
            if(data.result.length > 1){
                result = data.result;
                title = result.shift();
                puertos.map( (nombre_puerto)=>{
                    result.map( (servicios_data)=>{
                        if(nombre_puerto[0] == servicios_data[1]){

                            if (typeof(data_relacion[nombre_puerto[0]]) == "undefined"){
                                data_relacion[nombre_puerto[0]] =   {
                                                    puerto_nombre:nombre_puerto[0],
                                                    lat: Number(servicios_data[3]),
                                                    lon: Number(servicios_data[4]),
                                                    servicios: []
                                                };
                            }
                            let flag = true;
                            for(let i = 0; i < data_relacion[nombre_puerto].servicios.length ; i++){
                                if(data_relacion[nombre_puerto].servicios[i] == servicios_data[0]){
                                    flag = false;
                                }
                            }
                            if(flag) data_relacion[nombre_puerto].servicios.push(servicios_data[0]);
                        }
                    })
                })
            }
            relacion_puerto_servicio = data_relacion;

            data_relacion_sort = []
            $.each(data_relacion, function(k,v){
                data_relacion_sort.push(v)
            });

            let swapped;
            do {
                swapped = false;
                data_relacion_sort.forEach((el, ind, arr) => {
                    if (ind != arr.length - 1){
                        if (el.lat < arr[ind+1].lat){
                            var temp = arr[ind]
                            arr[ind] = arr[ind+1];
                            arr[ind+1] = temp;
                            swapped = true;
                        }
                    }
                })
            } while (swapped);

            $.each(data_relacion_sort, function(k,v){
                    let txt = '<option value="'+v.puerto_nombre+'">'+v.puerto_nombre+'</option>';
                    $("#lista_puertos").append(txt);
            });
            loadDataImportacionExportacion_tab("https://api.datos.observatoriologistico.cl/api/v2/datastreams/TEST-12708/data.ajson/?auth_key=",key);


        }
    }))
};
//Fin Relacion entre Puertos y Servicios

///////////////////////////////////////////////////////////////
/////////// Datos Segunda tabla en filtro por puerto  /////////
///////////////////////////////////////////////////////////////

// Datos de puerto, Toneladas Exportadas e Importadas
var loadDataToneladasExportacion_puerto = (nombre_puerto,operacion) => {

    if(operacion == "Exportación"){
        let max = 0;
        $.each(data_exportacion_por_puerto, function(k,v){
            if(v.anio > max){
                $.each(v.puerto, function(k_2,v_2){
                    if(v_2.nombre_puerto == nombre_puerto) max = v.anio
                });
            }
        });
        d3.select("#puertos_exportacion").text(d3.round(data_exportacion_por_puerto[String(max)].puerto[nombre_puerto].tot).toLocaleString('de-DE'));

    }

    if(operacion == "Importación"){
        let max = 0;

        $.each(data_importacion_por_puerto, function(k,v){
            if(v.anio > max){
                $.each(v.puerto, function(k_2,v_2){
                    if(v_2.nombre_puerto == nombre_puerto) max = v.anio
                });
            }
        });
       d3.select("#puertos_importacion").text(d3.round(data_importacion_por_puerto[String(max)].puerto[nombre_puerto].tot).toLocaleString('de-DE'));
    }
}
// Fin Datos de puerto, Toneladas Exportadas e Importadas

// Datos de puerto, Nave Atracadas
var loadDataNaveAtracadas_puerto = (nombre_puerto) => {
    let max = 0;
    let temp = 0;
    for (let i = 0; i < data_naves_atracadas.length; i++) {
        if (Number(data_naves_atracadas[i][0]) > max){
            temp = data_naves_atracadas[i][0];
            for (let k = 0; k < data_naves_atracadas.length; k++) {
                if( temp == data_naves_atracadas[k][0]){
                    if( ("Puerto de "+nombre_puerto) == data_naves_atracadas[k][1]){
                        max = Number(temp);
                    }
                }
            }
        }
    }

    let total = 0;
    for (let i = 0; i < data_naves_atracadas.length; i++) {
        if( data_naves_atracadas[i][0] == max) {
            if(data_naves_atracadas[i][1] == ("Puerto de "+nombre_puerto)){
                total += data_naves_atracadas[i][2];
            }
        }
    }
    if ( total == 0 ){
        d3.select("#puertos_naves_atracadas").text("Sin Información");
    }else{
        d3.select("#puertos_naves_atracadas").text(d3.round(total).toLocaleString('de-DE'));
    }

}
// Fin Datos de puerto, Nave Atracadas

// Datos de puerto, Tranferencia Maxima
var loadDataTranferenciaMaxima_puerto = (nombre_puerto) => {
    let max = 0;
    let temp = 0;
    for (let i = 0; i < data_tranferencia_maxima_glob.length; i++) {
        if (Number(data_tranferencia_maxima_glob[i][0]) > max){
            temp = data_tranferencia_maxima_glob[i][0];
            for (let k = 0; k < data_tranferencia_maxima_glob.length; k++) {
                if( temp == data_tranferencia_maxima_glob[k][0]){
                    if( ("Puerto de "+nombre_puerto) == data_tranferencia_maxima_glob[k][1]){
                        max = Number(temp);
                    }
                }
            }
        }
    }

    let total = 0;
    for (let i = 0; i < data_tranferencia_maxima_glob.length; i++) {
        if( data_tranferencia_maxima_glob[i][0] == max) {
            if(data_tranferencia_maxima_glob[i][1] == ("Puerto de "+nombre_puerto)){
                total += data_tranferencia_maxima_glob[i][2];
            }
        }
    }
    if ( total == 0 ){
        d3.select("#puertos_transferencia_maxima").text("Sin Información");
    }else{
        d3.select("#puertos_transferencia_maxima").text(d3.round(total).toLocaleString('de-DE'));
    }
}
// Fin Datos de puerto, Tranferencia Maxima

//////////////////////////////////////////////////////////
//////////// Graficos de Filtro Puertos Nacionales ///////
//////////////////////////////////////////////////////////

//Inicio Exportacion Importacion de Puertos Nacionales
var loadDataImportacionExportacion_tab = (url,apiKey) => {
    d3.json(base + url + apiKey + "&filter0=column2[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{
            let imp = {};
            let exp = {};
            let data_exp_imp_tot = {};

            result = data.result;
            title = result.shift();
            result.map((d)=>{
                 if(d[1] == "Importación"){

                     if (typeof(imp[d[2]]) == "undefined"){
                         imp[d[2]] = {
                                    puerto:{},
                                    anio:Number(d[2])
                                    };
                     }

                     if (typeof(imp[d[2]].puerto[d[0]]) == "undefined"){
                         imp[d[2]].puerto[d[0]] = {
                             tot:0,
                             nombre_puerto:d[0]
                         }
                     }
                     imp[d[2]].puerto[d[0]].tot += Number(d[4]);
                 }

                 if(d[1] == "Exportación"){
                     if (typeof(exp[d[2]]) == "undefined"){
                         exp[d[2]] = {
                                    puerto:{},
                                    anio:Number(d[2])
                                    };
                     }
                     if (typeof(exp[d[2]].puerto[d[0]]) == "undefined"){
                         exp[d[2]].puerto[d[0]] = {
                             tot:0,
                             nombre_puerto:d[0]
                         }
                     }
                     exp[d[2]].puerto[d[0]].tot += Number(d[4]);
                 }
                 //total
                 if (typeof(data_exp_imp_tot[d[2]]) == "undefined"){
                     data_exp_imp_tot[d[2]] = {
                                puerto:{},
                                anio:Number(d[2])
                                };
                 }
                 if (typeof(data_exp_imp_tot[d[2]].puerto[d[0]]) == "undefined"){
                     data_exp_imp_tot[d[2]].puerto[d[0]] = {
                         tot:0,
                         nombre_puerto:d[0]
                     }
                 }
                 data_exp_imp_tot[d[2]].puerto[d[0]].tot += Number(d[4]);
            });

            data_exportacion_por_puerto = exp;
            data_importacion_por_puerto = imp;


            loadChartExportacion_tab(exp);
            loadChartImportacion_tap(imp);
            loadChartTranferencia_tab(data_exp_imp_tot);
            loadDataNaveAtracadas_tab("https://api.datos.observatoriologistico.cl/api/v2/datastreams/CANTI-DE-NAVES-ATRAC/data.ajson/?auth_key=",key);
            loadDataTranferenciaMaxima_tab("https://api.datos.observatoriologistico.cl/api/v2/datastreams/TRANS-MAXIM-DE-TEUS/data.ajson/?auth_key=",key);


        }
    }));
}
// Grafico Importacion Puertos Nacionales
function loadChartImportacion_tap(data_importacion){

    let max = 0;

    $.each(data_importacion, function(k,v){
            if(v.anio > max) max = v.anio;
    });

    let data_imp = [];
    let aux = {};
    $.each(relacion_puerto_servicio, function(k,v){
      $.each(data_importacion[String(max)].puerto, function(k_2,v_2){
              if (v.puerto_nombre == v_2.nombre_puerto) {
                  aux = {
                      tot: v_2.tot,
                      nombre_puerto:v_2.nombre_puerto,
                      lat:Number(v.lat),
                      lon:Number(v.lon)
                  };

                  data_imp.push(aux);
              }
      });
    });

    let swapped;
    do {
        swapped = false;
        data_imp.forEach((el, ind, arr) => {
            if (ind != arr.length - 1){
                if (el.lat < arr[ind+1].lat){
                    var temp = arr[ind]
                    arr[ind] = arr[ind+1];
                    arr[ind+1] = temp;
                    swapped = true;
                }
            }
        })
    } while (swapped);

    //
    let _margin = {top: 30, right: 10, bottom: 10, left: $('.lineas_grahp_cl_1').width()/4};
      if($(window).width()< 768){
        _margin = {top: 30, right: 0, bottom: 10, left: $('.lineas_grahp_cl_1').width()/3.7}

      }
    let _width = $('.evolucion_poblacion').width();

    var barras_importacion = d3.cloudshapes.rowChartMtt_v2()
                        .width(_width)
                        .height(280)
                        .data(data_imp.map((d) => {
                          return d3.round(d.tot);
                        }))
                        .labels(data_imp.map((d) => {
                          return d.nombre_puerto;
                        }))
                        .setColor('#3189b0')
                        .showUnitAxis(false)
                        .dataTitle('')
                        .dataUnit('Toneladas')
                        .showRowText(false)
                        .selectable(false)
                        .margin(_margin)
                        .strokeOverColor("rgb(47, 95, 146)")
                        ;
    d3.select('#tab_puerto_importacion').call(barras_importacion)

}

// Grafico Exportacion Puertos Nacionales
function loadChartExportacion_tab(data_exportacion){
    let max = 0;

    $.each(data_exportacion, function(k,v){
            if(v.anio > max) max = v.anio;
    });

    let data_ex = [];
    let aux = {};
    $.each(relacion_puerto_servicio, function(k,v){
      $.each(data_exportacion[String(max)].puerto, function(k_2,v_2){
              if (v.puerto_nombre == v_2.nombre_puerto) {
                  aux = {
                      tot: v_2.tot,
                      nombre_puerto:v_2.nombre_puerto,
                      lat:Number(v.lat),
                      lon:Number(v.lon)
                  };

                  data_ex.push(aux);
              }
      });
    });

    // //sort
    let swapped;
    do {
        swapped = false;
        data_ex.forEach((el, ind, arr) => {
            if (ind != arr.length - 1){
                if (el.lat < arr[ind+1].lat){
                    var temp = arr[ind]
                    arr[ind] = arr[ind+1];
                    arr[ind+1] = temp;
                    swapped = true;
                }
            }
        })
    } while (swapped);

    let _margin = {top: 30, right: 10, bottom: 10, left: $('.lineas_grahp_cl_1').width()/4};
      if($(window).width()< 768){
        _margin = {top: 30, right: 0, bottom: 10, left: $('.lineas_grahp_cl_1').width()/3.7}

      }
    let _width = $('.evolucion_poblacion').width();

    var barras_exportacion = d3.cloudshapes.rowChartMtt_v2()
                        .width(_width)
                        .height(280)
                        .data(data_ex.map((d) => {
                          return d3.round(d.tot);
                        }))
                        .labels(data_ex.map((d) => {
                          return d.nombre_puerto;
                        }))
                        .setColor('#3189b0')
                        .showUnitAxis(false)
                        .dataTitle('')
                        .dataUnit('Toneladas')
                        .showRowText(false)
                        .selectable(false)
                        .margin(_margin)
                        .strokeOverColor("rgb(47, 95, 146)")
                        ;
    d3.select('#tab_puerto_exportacion').call(barras_exportacion)

}
//Fin Exportacion Importacion de Puertos Nacionales

// Inicio Naves atracadas en Puertos Nacionales
var loadDataNaveAtracadas_tab = (url,apiKey) => {
    d3.json(base + url + apiKey + "&filter0=column0[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{

            result = data.result;
            title = result.shift();
            data_naves_atracadas = result;

            loadChartNaveAtracadas_tab(result);
        }
    }))
}
function loadChartNaveAtracadas_tab(data_naves_atracadas){
    let max = d3.max(data_naves_atracadas.map((d)=>{return Number(d[0]);}))
    let data = [];
    let aux_1 = {};
    for (let i = 0; i < data_naves_atracadas.length; i++) {
        if(data_naves_atracadas[i][0] == max){
                aux_1 = {
                    //Sacar del nombre "Puerto de "
                    nombre_puerto:data_naves_atracadas[i][1].substring(10),
                    //
                    cant_naves: data_naves_atracadas[i][2]
                }
                data.push(aux_1);
        }
    }
    data_naves_atracadas_show = [];
    let aux = {};
    $.each(relacion_puerto_servicio, function(k,v){
      $.each(data, function(k_2,v_2){
              if (v.puerto_nombre == v_2.nombre_puerto) {
                  aux = {
                      cant_naves: v_2.cant_naves,
                      nombre_puerto:v_2.nombre_puerto,
                      lat:Number(v.lat),
                      lon:Number(v.lon)
                  };

                  data_naves_atracadas_show.push(aux);
              }
      });
    });
    // //sort
    let swapped;
    do {
        swapped = false;
        data_naves_atracadas_show.forEach((el, ind, arr) => {
            if (ind != arr.length - 1){
                if (el.lat < arr[ind+1].lat){
                    var temp = arr[ind]
                    arr[ind] = arr[ind+1];
                    arr[ind+1] = temp;
                    swapped = true;
                }
            }
        })
    } while (swapped);

    let _margin = {top: 30, right: 10, bottom: 10, left: $('.lineas_grahp_cl_1').width()/4};
      if($(window).width()< 768){
        _margin = {top: 30, right: 0, bottom: 10, left: $('.lineas_grahp_cl_1').width()/3}

      }
    let _width = $('.evolucion_poblacion').width();

    var barras_naves_atracadas = d3.cloudshapes.rowChartMtt_v2()
                        .width(_width)
                        .height(280)
                        .data(data_naves_atracadas_show.map((d) => {
                          return d.cant_naves;
                        }))
                        .labels(data_naves_atracadas_show.map((d) => {
                          return d.nombre_puerto;
                        }))
                        .setColor('#3189b0')
                        .showUnitAxis(false)
                        .dataTitle('')
                        .dataUnit('Naves Atracadas')
                        .showRowText(false)
                        .selectable(false)
                        .margin(_margin)
                        .strokeOverColor("rgb(47, 95, 146)")
                        ;
    d3.select('#tab_puerto_naves_atracadas').call(barras_naves_atracadas)

}
// Fin Naves atracadas en Puertos Nacionales


// Transferecia en Puertos Nacionales
function loadChartTranferencia_tab(data_tranferencia){

    let max = 0;

    $.each(data_tranferencia, function(k,v){
            if(v.anio > max) max = v.anio;
    });

    let data_tranferencia_total = [];
    let aux = {};
    $.each(relacion_puerto_servicio, function(k,v){
      $.each(data_tranferencia[String(max)].puerto, function(k_2,v_2){
              if (v.puerto_nombre == v_2.nombre_puerto) {
                  aux = {
                      tot: v_2.tot,
                      nombre_puerto:v_2.nombre_puerto,
                      lat:Number(v.lat),
                      lon:Number(v.lon)
                  };

                  data_tranferencia_total.push(aux);
              }
      });
    });

    // //sort

    let swapped;
    do {
        swapped = false;
        data_tranferencia_total.forEach((el, ind, arr) => {
            if (ind != arr.length - 1){
                if (el.lat < arr[ind+1].lat){
                    var temp = arr[ind]
                    arr[ind] = arr[ind+1];
                    arr[ind+1] = temp;
                    swapped = true;
                }
            }
        })
    } while (swapped);

    ////

        let _margin = {top: 30, right: 10, bottom: 10, left: $('.lineas_grahp_cl_1').width()/4};
          if($(window).width()< 768){
            _margin = {top: 30, right: 0, bottom: 10, left: $('.lineas_grahp_cl_1').width()/3.7}

          }
        let _width = $('.evolucion_poblacion').width();
        var barras_transferencias = d3.cloudshapes.rowChartMtt_v2()
                            .width(_width)
                            .height(280)
                            .data(data_tranferencia_total.map((d) => {
                              return d3.round(d.tot);
                            }))
                            .labels(data_tranferencia_total.map((d) => {
                              return d.nombre_puerto;
                            }))
                            .setColor('#3189b0')
                            .showUnitAxis(false)
                            .dataTitle('')
                            .dataUnit('Toneladas')
                            .showRowText(false)
                            .selectable(false)
                            .margin(_margin)
                            .strokeOverColor("rgb(47, 95, 146)")
                            ;
        d3.select('#tab_puerto_tranferencia').call(barras_transferencias)

}
// Fin Transferecia en Puertos Nacionales

// Transferecia Maxima en Puertos Nacionales
var loadDataTranferenciaMaxima_tab = (url,apiKey) => {
    d3.json(base + url + apiKey + "&filter0=column0[<=]"+anio_actual+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{

            result = data.result;
            title = result.shift();
            data_tranferencia_maxima_glob = result;
            loadChartTranferenciaMaxima_tab(result);
        }
    }))
}
function loadChartTranferenciaMaxima_tab(data_tranferencia_maxima){

    let max = d3.max(data_tranferencia_maxima.map((d)=>{return Number(d[0]);}))

    let data = [];
    let aux_1 = {};
    for (let i = 0; i < data_tranferencia_maxima.length; i++) {
        if(data_tranferencia_maxima[i][0] == max){
                aux_1 = {
                    //Sacar del nombre "Puerto de "
                    nombre_puerto:data_tranferencia_maxima[i][1].substring(10),
                    //
                    teus: data_tranferencia_maxima[i][2]
                }
                data.push(aux_1);
        }
    }

    data_transf_total = [];
    let aux = {};
    $.each(relacion_puerto_servicio, function(k,v){
      $.each(data, function(k_2,v_2){
              if (v.puerto_nombre == v_2.nombre_puerto) {
                  aux = {
                      teus: v_2.teus,
                      nombre_puerto:v_2.nombre_puerto,
                      lat:Number(v.lat),
                      lon:Number(v.lon)
                  };

                  data_transf_total.push(aux);
              }
      });
    });
    // //sort
    let swapped;
    do {
        swapped = false;
        data_transf_total.forEach((el, ind, arr) => {
            if (ind != arr.length - 1){
                if (el.lat < arr[ind+1].lat){
                    var temp = arr[ind]
                    arr[ind] = arr[ind+1];
                    arr[ind+1] = temp;
                    swapped = true;
                }
            }
        })
    } while (swapped);

    let _margin = {top: 30, right: 10, bottom: 10, left: $('.lineas_grahp_cl_1').width()/4};
      if($(window).width()< 768){
        _margin = {top: 30, right: 0, bottom: 10, left: $('.lineas_grahp_cl_1').width()/3}
      }

    let _width = $('.evolucion_poblacion').width();

    var barras_transferencias_maxima = d3.cloudshapes.rowChartMtt_v2()
                        .width(_width)
                        .height(280)
                        .data(data_transf_total.map((d) => {
                          return d.teus;
                        }))
                        .labels(data_transf_total.map((d) => {
                          return d.nombre_puerto;
                        }))
                        .setColor('#3189b0')
                        .showUnitAxis(false)
                        .dataTitle('Uso')
                        .dataUnit('TEUs')
                        .showRowText(false)
                        .selectable(false)
                        .margin(_margin)
                        .strokeOverColor("rgb(47, 95, 146)")
                        ;
    d3.select('#tab_puerto_tranferencia_maxima').call(barras_transferencias_maxima)

}
// Transferecia Maxima en Puertos Nacionales

////////////////////////////////////////////
///////////////// Map //////////////////////
////////////////////////////////////////////

var map;
// Iniciar Mapa
function initMap(){
    let _width_mapa = $('.mapa_cl').width();
    let _margin_pavimentada_line = {top: 20, right: 50, bottom: 50, left: 90}
    let _rotation_pavimentada_line = 18;

    var map_get = document.getElementById('mapa_perfil');

    map_get.style.width = _width_mapa+"px";
    map_get.style.height="500px";

       map = new google.maps.Map(map_get, {
         center: {lat: -34.397, lng: 150.644},
         zoom: 2,
         styles: [
  {
    "elementType": "geometry",
    "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8ec3b9"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1a3646"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#4b6878"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#64779e"
              }
            ]
          },
          {
            "featureType": "administrative.neighborhood",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#4b6878"
              }
            ]
          },
          {
            "featureType": "landscape.man_made",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#334e87"
              }
            ]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#283d6a"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#6f9ba5"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3C7680"
              }
            ]
          },
          {
            "featureType": "road",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#304a7d"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#98a5be"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#2c6675"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#255763"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#b0d5ce"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#98a5be"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#283d6a"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3a4762"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#0e1626"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#4e6d70"
              }
            ]
          }
        ]
       });
       loadRutasServicios(url[11],key);
       loadListaPuertos(url[16],key);
}
//Fin inicio de mapa

var flightPath;
var markadores = []
var lineas_puerto = [];
var markadores_por_puerto = [];

// Inicio Actualizar mapa en Funcion de un Cambio en Lista de Servicios
$("#filtro_servicios").change( function(){
    var flightPlanCoordinates = rutas[$("#filtro_servicios").val()].ruta.map((d,ind)=>{

        if(typeof(d) != "undefined") return {lat:Number(d.lat), lng:Number(d.lon) , name_puerto:d.name, posicion_recorrido:String(ind),recorrido_acumulado:String(ind)+", " }; // arreglar este if para que no pasen los vasios
    })
    flightPlanCoordinates.shift();
    let features = [];
    for( let k = 0; k < flightPlanCoordinates.length ; k++){
        for( let i = 0; i < flightPlanCoordinates.length ; i++){
            if(flightPlanCoordinates[k].name_puerto == flightPlanCoordinates[i].name_puerto && k != i){
                flightPlanCoordinates[k].recorrido_acumulado+= String(i+1)+", ";
            }
        }
    };
    let acumulado = [];
    flightPlanCoordinates.map((d,ind)=>{

        if(d.recorrido_acumulado.length > 3){
            let flag = true;
            for(let i = 0; i < acumulado.length; i++){
                if (acumulado[i] == d.name_puerto) flag = false;
            }
            if(flag){
                features.push({position: new google.maps.LatLng(d.lat, d.lng) , name:d.name_puerto, recorrido:d.recorrido_acumulado});
                acumulado.push(d.name_puerto);
            }

        }else{
            features.push({position: new google.maps.LatLng(d.lat, d.lng) , name:d.name_puerto, recorrido:d.recorrido_acumulado});
        }
    });

    if(markadores.length != 0 ){
        markadores.map((d)=>{
            d.setMap(null)
        })
    }

    if(markadores_por_puerto.length != 0){
        markadores_por_puerto.map((array)=>{
            if(typeof(array) != "string" )
                array.map((markers_puertos)=>{
                    markers_puertos.setMap(null);
                })
        });
    }
    if(lineas_puerto.length != 0 ){
        lineas_puerto.map((lineas)=>{
            if(typeof(lineas) != "string")
                    lineas.setMap(null);
        });
    }

    if(typeof(flightPath) != "undefined") flightPath.setMap(null);

    markadores = [];
    markadores_por_puerto = [];
    lineas_puerto = [];

    features.forEach(function(feature,ind) {
          var marker = new google.maps.Marker({
            position: feature.position,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 9,
                strokeColor: '#B6D0F1',
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: '#2E85ED',
                fillOpacity: 0.35,
            },
            map: map,
          });

          markadores.push(marker);

          var contentString =
              '<div id="infowindow_'+feature.recorrido+'" >'+
              '<p id="firstHeading" style="font-weight: bold;">'+feature.name+'</p>'+

              '<p style="font-weight:normal; font-size:15px">Posición en recorrido: '+feature.recorrido.substring(0,feature.recorrido.length-2)+'</p>'+
              '</div>';


          var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 200
          });
          marker.addListener('mouseover', function() {
            infowindow.open(map, marker);
          });
          marker.addListener('mouseout', function() {
          infowindow.close()
        });

    });

    lineCoordinates = flightPlanCoordinates.map( (d)=>{
        return new google.maps.LatLng(d.lat, d.lng);
    });

    var sphericalLib = google.maps.geometry.spherical;

    pointDistances = [];
    var pointZero = lineCoordinates[0];
    var wholeDist= 0;
    for(let i = 0 ; i < lineCoordinates.length-1 ; i++){
        wholeDist += sphericalLib.computeDistanceBetween(
                            lineCoordinates[i],
                            lineCoordinates[i+1]);
    }
    let acum_dist = 0;
    pointDistances[0] = 0;
    for (var i = 0; i < lineCoordinates.length-1; i++) {
        acum_dist += sphericalLib.computeDistanceBetween(lineCoordinates[i], lineCoordinates[i+1]);
        pointDistances[i+1] = 100 * acum_dist / wholeDist;

    }

    var lineSymbol = {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 2,
          strokeColor: '#B6D3FE'
        };

        var lineSymbol_circle = {
         path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
         scale: 4,
         strokeOpacity: 1,
         strokeColor: '#81BEF7'
       };

    flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        strokeOpacity: 0,

        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '10px'
        },{
            icon: lineSymbol_circle,

            offset: '100%',

        }
        ]
    });
    flightPath.setMap(map);

    animateCircle(flightPath);
    zoomToObject(flightPath);

});
// Fin Actualizar mapa en Funcion de un Cambio en Lista de Servicios

//Inicio Zoom en Ruta de Servicios
function zoomToObject(obj){
    var bounds = new google.maps.LatLngBounds();
    var points = obj.getPath().getArray();
    for (var n = 0; n < points.length ; n++){
        bounds.extend(points[n]);
    }
    map.fitBounds(bounds);
}
//Fin Zoom en Ruta de Servicios

var id;
var ind_markets_animation = 0;

// Inicio Animacion de Ruta de Servicio
var interval_animate;
function animateCircle(line) {
         var count = 0;
         stop_animation(interval_animate);
         interval_animate = window.setInterval(function() {
           count = (count + 0.5) % 200;

           var icons = line.get('icons');
           icons[1].offset = (count / 2) + '%';
           line.set('icons', icons);
       }, 20);
}
// Fin Inicio Animacion de Ruta de Servicio

// Inicio Parar Animacion
function stop_animation(interval_animate){
    if(typeof(interval_animate) != "undefined"){
        clearInterval(interval_animate);
    }
}
// Fin Parar Animacion


// Inicio Actualizar tabla de Sercicios de Filtro de Puertos Nacionales
function borrar(nuevo_puerto,servicios){
    let lista = d3.select("#lista_filtro_puerto");
    servicios.map((d)=>{
        tr = lista.append("tr");
        tr.append("td").attr("class","text-center").text(datos_servicios[d].nombre_servicio);
        tr.append("td").attr("class","text-center").text(datos_servicios[d].cant_naves.toLocaleString('de-DE'));
        tr.append("td").attr("class","text-center").text(datos_servicios[d].cant_teus.toLocaleString('de-DE'));
        tr.append("td").attr("class","text-center").text(datos_servicios[d].frecuencia.toLocaleString('de-DE'));

    })
}
// Fin Actualizar tabla de Sercicios de Filtro de Puertos Nacionales

// Inicio Actualizar tabla de Datos de Puertos Nacionales
function actualizar_datos_transferencia_puertos(nombre_puerto){
    d3.select("#puertos_cant_servicios").text(relacion_puerto_servicio[nombre_puerto].servicios.length);
    loadDataToneladasExportacion_puerto(nombre_puerto,"Exportación");
    loadDataToneladasExportacion_puerto(nombre_puerto,"Importación");
    loadDataNaveAtracadas_puerto(nombre_puerto);
    loadDataTranferenciaMaxima_puerto(nombre_puerto);
}
// Fin Actualizar tabla de Datos de Puertos Nacionales

//Inicio Actualizar mapa en Funcion de un Cambio en Lista Desplegable de Puertos Nacionales
$("#lista_puertos").change(()=>{
    document.getElementById("lista_filtro_puerto").innerHTML="";

    if(markadores.length != 0 ){
        markadores.map((d)=>{
            d.setMap(null)
        })
    }
    if(markadores_por_puerto.length != 0){
        markadores_por_puerto.map((array)=>{
            if(typeof(array) != "string" )
                array.map((markers_puertos)=>{
                    markers_puertos.setMap(null);
                })
        });
    }
    if(lineas_puerto.length != 0 ){

        lineas_puerto.map((lineas)=>{
        if(typeof(lineas) != "string")
                    lineas.setMap(null);
        });
    }

    if(typeof(flightPath) != "undefined") flightPath.setMap(null);

    markadores = [];
    markadores_por_puerto = [];
    lineas_puerto = [];

    borrar($("#lista_puertos").val(),relacion_puerto_servicio[$("#lista_puertos").val()].servicios);

    actualizar_datos_transferencia_puertos($("#lista_puertos").val());

    var color_scale = d3.scale.category20c();

    relacion_puerto_servicio[$("#lista_puertos").val()].servicios.map((d,ind)=>{
        markadores_por_puerto.push(d);
        lineas_puerto.push(d);

        var flightPlanCoordinates = rutas[d].ruta.map((d_1,ind)=>{
            if(typeof(d_1) != "undefined") return {lat:Number(d_1.lat), lng:Number(d_1.lon) , name_puerto:d_1.name, posicion_recorrido:String(ind),recorrido_acumulado:String(ind)+", " }; // arreglar este if para que no pasen los vasios
        })

        flightPlanCoordinates.shift();

        let features = [];

        for( let k = 0; k < flightPlanCoordinates.length ; k++){
            for( let i = 0; i < flightPlanCoordinates.length ; i++){
                if(flightPlanCoordinates[k].name_puerto == flightPlanCoordinates[i].name_puerto && k != i){
                    flightPlanCoordinates[k].recorrido_acumulado+= String(i+1)+", ";
                }
            }
        };
        let acumulado = [];

        flightPlanCoordinates.map((d_2,ind)=>{

            if(d_2.recorrido_acumulado.length > 3){
                let flag = true;
                for(let i = 0; i < acumulado.length; i++){
                    if (acumulado[i] == d_2.name_puerto) flag = false;
                }
                if(flag){
                    features.push({position: new google.maps.LatLng(d_2.lat, d_2.lng) , name:d_2.name_puerto, recorrido:d_2.recorrido_acumulado});
                    acumulado.push(d_2.name_puerto);
                }

            }else{
                features.push({position: new google.maps.LatLng(d_2.lat, d_2.lng) , name:d_2.name_puerto, recorrido:d_2.recorrido_acumulado});
            }
        });

        mark_temp = []
        features.forEach(function(feature,ind) {

              var marker = new google.maps.Marker({
                position: feature.position,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 9,
                    strokeColor: '#B6D0F1',
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: '#2E85ED',
                    fillOpacity: 0.35
                },
                map: map
              });

              var contentString =
                  '<div id="infowindow_'+feature.recorrido+'" >'+
                  '<p id="firstHeading" style="font-weight: bold;">'+feature.name+'</p>'+

                  '<p style="font-weight:normal; font-size:15px">Posición en recorrido: '+feature.recorrido.substring(0,feature.recorrido.length-2)+'</p>'+
                  '</div>';



              var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 200
              });
              marker.addListener('mouseover', function() {
                  infowindow.open(map, marker);
              });
              marker.addListener('mouseout', function() {
                  infowindow.close()
              });
              marker.setMap(null);
              mark_temp.push(marker);
        });
        markadores_por_puerto.push(mark_temp);


        lineCoordinates = flightPlanCoordinates.map( (d_3)=>{
            return new google.maps.LatLng(d_3.lat, d_3.lng);
        });

        var sphericalLib = google.maps.geometry.spherical;

        pointDistances = [];
        var pointZero = lineCoordinates[0];
        var wholeDist= 0;
        for(let i = 0 ; i < lineCoordinates.length-1 ; i++){
            wholeDist += sphericalLib.computeDistanceBetween(
                                lineCoordinates[i],
                                lineCoordinates[i+1]);
        }

        let acum_dist = 0;
        pointDistances[0] = 0;
        for (var i = 0; i < lineCoordinates.length-1; i++) {
            acum_dist += sphericalLib.computeDistanceBetween(lineCoordinates[i], lineCoordinates[i+1]);
            pointDistances[i+1] = 100 * acum_dist / wholeDist;
        }
        var lineSymbol = {
              path: 'M 0,-1 0,1',
              strokeOpacity: 1,
              scale: 2,
              strokeColor: color_scale(ind),
            };

        var lineSymbol_circle = {
             path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
             scale: 4,
             strokeOpacity: 1,
             strokeColor: '#81BEF7'
        };

        var flightPath_puerto = new google.maps.Polyline({
            path: flightPlanCoordinates,
            strokeOpacity: 0,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '10px'
            },{
                icon: lineSymbol_circle,
                offset: '100%',

            }
            ]
        });

        flightPath_puerto.setMap(map);
        lineas_puerto.push(flightPath_puerto);
    })
});
//Fin Actualizar mapa en Funcion de un Cambio en Lista Desplegable de Puertos Nacionales

//Inicio Actualizar mapa en Funcion de Click en tabla de Filtro por Servicio
$('#lista_filtro_puerto').on('click','tr', function(evt){
    if(markadores_por_puerto.length != 0){
        markadores_por_puerto.map((array)=>{
            if(typeof(array) != "string" )
                array.map((markers_puertos)=>{
                    markers_puertos.setMap(null);
                })
        });
    }
    let flag = false;
    if(markadores_por_puerto.length != 0){
        markadores_por_puerto.map((array)=>{
            if(typeof(array) == "string" ){
                if(array == $(this).first()[0].childNodes[0].innerText) flag = true;
            }else{
                if(flag){
                    array.map((markers_puertos)=>{
                        markers_puertos.setMap(map);
                    })
                    flag = false;
                }
            }

        });
    flag = false;
    if(lineas_puerto.length != 0 ){
            lineas_puerto.map((lineas)=>{
                if(typeof(lineas) == "string"){
                    if(lineas == $(this).first()[0].childNodes[0].innerText) flag = true;
                }else{
                    if(flag){
                        lineas.setMap(map);
                        zoomToObject(lineas);
                        animateCircle(lineas);
                        flag = false
                    }else{
                        lineas.setMap(null);
                    }
                }
            });
        }
    }
});
//Fin  Actualizar mapa en Funcion de Click en tabla de Filtro por Servicio

//Inicio Actualizar mapa en Funcion de Click en tabla de Filtro por Puertos Nacionales
$('#lista_servicios').on('click','tr', function(evt){
     $("#filtro_servicios").val($(this).first()[0].childNodes[0].innerText);
    cambio_filtro_servicio();
});

function cambio_filtro_servicio(init = false, dat = ""){
    var flightPlanCoordinates;
    if(init){
        flightPlanCoordinates = rutas[dat].ruta.map((d,ind)=>{
           if(typeof(d) != "undefined") return {lat:Number(d.lat), lng:Number(d.lon) , name_puerto:d.name, posicion_recorrido:String(ind),recorrido_acumulado:String(ind)+", " };
       });
    }else{
        flightPlanCoordinates = rutas[$("#filtro_servicios").val()].ruta.map((d,ind)=>{
           if(typeof(d) != "undefined") return {lat:Number(d.lat), lng:Number(d.lon) , name_puerto:d.name, posicion_recorrido:String(ind),recorrido_acumulado:String(ind)+", " };
       });
    }

    flightPlanCoordinates.shift();

    let features = [];

    for( let k = 0; k < flightPlanCoordinates.length ; k++){
        for( let i = 0; i < flightPlanCoordinates.length ; i++){
            if(flightPlanCoordinates[k].name_puerto == flightPlanCoordinates[i].name_puerto && k != i){
                flightPlanCoordinates[k].recorrido_acumulado+= String(i+1)+", ";
            }
        }
    };
    let acumulado = [];
    flightPlanCoordinates.map((d,ind)=>{

        if(d.recorrido_acumulado.length > 3){
            let flag = true;
            for(let i = 0; i < acumulado.length; i++){
                if (acumulado[i] == d.name_puerto) flag = false;
            }
            if(flag){
                features.push({position: new google.maps.LatLng(d.lat, d.lng) , name:d.name_puerto, recorrido:d.recorrido_acumulado});
                acumulado.push(d.name_puerto);
            }

        }else{
            features.push({position: new google.maps.LatLng(d.lat, d.lng) , name:d.name_puerto, recorrido:d.recorrido_acumulado});
        }
    });

    if(markadores.length != 0 ){
        markadores.map((d)=>{
            d.setMap(null)
        })
    }
    if(markadores_por_puerto.length != 0){
        markadores_por_puerto.map((array)=>{
            if(typeof(array) != "string" )
                array.map((markers_puertos)=>{
                    markers_puertos.setMap(null);
                })
        });
    }
    if(lineas_puerto.length != 0 ){
        lineas_puerto.map((lineas)=>{
            if(typeof(lineas) != "string")
                    lineas.setMap(null);
        });
    }

    if(typeof(flightPath) != "undefined") flightPath.setMap(null);

    markadores = [];
    markadores_por_puerto = [];
    lineas_puerto = [];


    features.forEach(function(feature,ind) {
          var marker = new google.maps.Marker({
            position: feature.position,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 9,
                strokeColor: '#B6D0F1',
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: '#2E85ED',
                fillOpacity: 0.35
            },
            map: map
          });
          markadores.push(marker);
          var contentString =
              '<div id="infowindow_'+feature.recorrido+'" >'+
              '<p id="firstHeading" style="font-weight: bold;">'+feature.name+'</p>'+

              '<p style="font-weight:normal; font-size:15px">Posición en recorrido: '+feature.recorrido.substring(0,feature.recorrido.length-2)+'</p>'+
              '</div>';


          var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 200
          });
          marker.addListener('mouseover', function() {
            infowindow.open(map, marker);
          });
          marker.addListener('mouseout', function() {
          infowindow.close()
        });

    });

    lineCoordinates = flightPlanCoordinates.map( (d)=>{
        return new google.maps.LatLng(d.lat, d.lng);
    });

    var sphericalLib = google.maps.geometry.spherical;
    pointDistances = [];
    var pointZero = lineCoordinates[0];
    var wholeDist= 0;
    for(let i = 0 ; i < lineCoordinates.length-1 ; i++){
        wholeDist += sphericalLib.computeDistanceBetween(
                            lineCoordinates[i],
                            lineCoordinates[i+1]);
    }
    let acum_dist = 0;
    pointDistances[0] = 0;
    for (var i = 0; i < lineCoordinates.length-1; i++) {
        acum_dist += sphericalLib.computeDistanceBetween(lineCoordinates[i], lineCoordinates[i+1]);
        pointDistances[i+1] = 100 * acum_dist / wholeDist;
    }
    var lineSymbol = {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 2,
          strokeColor: '#B6D3FE'
        };

        var lineSymbol_circle = {
         path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
         scale: 4,
         strokeOpacity: 1,
         strokeColor: '#81BEF7'
       };
    flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '10px'
        },{
            icon: lineSymbol_circle,

            offset: '100%',

        }
        ]
    });
    flightPath.setMap(map);

    animateCircle(flightPath);
    zoomToObject(flightPath);
}
//Fin  Actualizar mapa en Funcion de Click en tabla de Filtro por Puertos Nacionales


document. getElementById("tab_detalles_puertos"). style. display = "none";
//Inicio Click En Tab de Filtro por Servicios
$( "#tab_1" ).click(function(){
    document.getElementById("filtro_servicios").selectedIndex = 0 ;
    cambio_filtro_servicio();
    document. getElementById("tab_detalles_puertos"). style. display = "none";
});
//Fin Click En Tab de Filtro por Servicios

//Inicio Click En Tab de Filtro por Puertos Nacionales
$( "#tab_2" ).click(function(){
    inicio_puerto();
    document. getElementById("tab_detalles_puertos"). style. display = "block";

});
function inicio_puerto(){
    document.getElementById("lista_filtro_puerto").innerHTML="";
    if(markadores.length != 0 ){
        markadores.map((d)=>{
            d.setMap(null)
        })
    }
    if(markadores_por_puerto.length != 0){
        markadores_por_puerto.map((array)=>{
            if(typeof(array) != "string" )
                array.map((markers_puertos)=>{
                    markers_puertos.setMap(null);
                })
        });
    }
    if(lineas_puerto.length != 0 ){

        lineas_puerto.map((lineas)=>{
        if(typeof(lineas) != "string")
                    lineas.setMap(null);
        });
    }
    if(typeof(flightPath) != "undefined") flightPath.setMap(null);
    markadores = [];
    markadores_por_puerto = [];
    lineas_puerto = [];
    borrar($("#lista_puertos").val(),relacion_puerto_servicio[$("#lista_puertos").val()].servicios);
    actualizar_datos_transferencia_puertos($("#lista_puertos").val());
    var color_scale = d3.scale.category20c();
    relacion_puerto_servicio[$("#lista_puertos").val()].servicios.map((d,ind)=>{
        markadores_por_puerto.push(d);
        lineas_puerto.push(d);
        var flightPlanCoordinates = rutas[d].ruta.map((d_1,ind)=>{
            if(typeof(d_1) != "undefined") return {lat:Number(d_1.lat), lng:Number(d_1.lon) , name_puerto:d_1.name, posicion_recorrido:String(ind),recorrido_acumulado:String(ind)+", " }; // arreglar este if para que no pasen los vasios
        })
        flightPlanCoordinates.shift();
        let features = [];
        for( let k = 0; k < flightPlanCoordinates.length ; k++){
            for( let i = 0; i < flightPlanCoordinates.length ; i++){
                if(flightPlanCoordinates[k].name_puerto == flightPlanCoordinates[i].name_puerto && k != i){
                    flightPlanCoordinates[k].recorrido_acumulado+= String(i+1)+", ";
                }
            }
        };
        let acumulado = [];
        flightPlanCoordinates.map((d_2,ind)=>{

            if(d_2.recorrido_acumulado.length > 3){
                let flag = true;
                for(let i = 0; i < acumulado.length; i++){
                    if (acumulado[i] == d_2.name_puerto) flag = false;
                }
                if(flag){
                    features.push({position: new google.maps.LatLng(d_2.lat, d_2.lng) , name:d_2.name_puerto, recorrido:d_2.recorrido_acumulado});
                    acumulado.push(d_2.name_puerto);
                }

            }else{
                features.push({position: new google.maps.LatLng(d_2.lat, d_2.lng) , name:d_2.name_puerto, recorrido:d_2.recorrido_acumulado});
            }
        });
        mark_temp = []

        features.forEach(function(feature,ind) {

              var marker = new google.maps.Marker({
                position: feature.position,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 9,
                    strokeColor: '#B6D0F1',
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: '#2E85ED',
                    fillOpacity: 0.35,

                },
                map: map
              });

              var contentString =
                  '<div id="infowindow_'+feature.recorrido+'" >'+
                  '<p id="firstHeading" style="font-weight: bold;">'+feature.name+'</p>'+

                  '<p style="font-weight:normal; font-size:15px">Posición en recorrido: '+feature.recorrido.substring(0,feature.recorrido.length-2)+'</p>'+
                  '</div>';


              var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 200
              });
              marker.addListener('mouseover', function() {
                  infowindow.open(map, marker);
              });
              marker.addListener('mouseout', function() {
                  infowindow.close()
              });
              marker.setMap(null);
              mark_temp.push(marker);
        });
        markadores_por_puerto.push(mark_temp);


        lineCoordinates = flightPlanCoordinates.map( (d_3)=>{
            return new google.maps.LatLng(d_3.lat, d_3.lng);
        });

        var sphericalLib = google.maps.geometry.spherical;

        pointDistances = [];
        var pointZero = lineCoordinates[0];
        var wholeDist= 0;
        for(let i = 0 ; i < lineCoordinates.length-1 ; i++){
            wholeDist += sphericalLib.computeDistanceBetween(
                                lineCoordinates[i],
                                lineCoordinates[i+1]);
        }

        let acum_dist = 0;
        pointDistances[0] = 0;
        for (var i = 0; i < lineCoordinates.length-1; i++) {
            acum_dist += sphericalLib.computeDistanceBetween(lineCoordinates[i], lineCoordinates[i+1]);
            pointDistances[i+1] = 100 * acum_dist / wholeDist;
        }
        var lineSymbol = {
              path: 'M 0,-1 0,1',
              strokeOpacity: 1,
              scale: 2,
              strokeColor: color_scale(ind),
            };

        var lineSymbol_circle = {
             path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
             scale: 4,
             strokeOpacity: 1,
             strokeColor: '#81BEF7'
        };

        var flightPath_puerto = new google.maps.Polyline({
            path: flightPlanCoordinates,
            strokeOpacity: 0,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '10px'
            },{
                icon: lineSymbol_circle,
                offset: '100%',

            }
            ]
        });
        flightPath_puerto.setMap(map);
        zoomToObject(flightPath_puerto);
        lineas_puerto.push(flightPath_puerto);
    })
}
//Fin Click En Tab de Filtro por Puertos Nacionales

///////////////////////////////////////
///  Comercio Exterior             ////
///////////////////////////////////////

anios = [];
function anios_a_filtrar(){
    for(let i = 2002; i <= (anio_actual) ; i++  ){
        anios.push(i);
    }
}
anios_a_filtrar();

// Inicio Slider Comercio Exterior
$("#slider_evolucion").ionRangeSlider({
            type:"simple",
            grid: true,
            values:anios,
            min: 2002,
            max: anio_actual,
            step:1,
            prettify_separator:"",
            from: anios.length-11,


            onChange: function( value ) {
                preDataEvolucionComercioExterior(value.from_value,value.to_value);
            }
});
//Fin Slider Comercio Exterior

//Inicio Evolucion Comercio Exterior
//Si ya se han descargado los datos, luego solo se actualizan los graficos

function preDataEvolucionComercioExterior(min,max){
    if( minimo_lineas == 0 ){
        loadDataEvolucionComercioExterior(url[4],key,min,max);
    }else{
        if((min < minimo_lineas && max < minimo_lineas) || min > maximo_lineas){

            if(document.getElementById('lineas_grahp_1').firstChild){
                document.getElementById("lineas_grahp_1").firstChild.remove();
                document.getElementById("lineas_grahp_2").firstChild.remove();
            }
            document.getElementById("titulo_lineas_1").innerHTML = 'Toneladas Sin Información';
            document.getElementById("titulo_lineas_2").innerHTML = 'Dólares Sin Información';
        }else{

            if(document.getElementById('lineas_grahp_1').firstChild){
                document.getElementById("lineas_grahp_1").firstChild.remove();
                document.getElementById("lineas_grahp_2").firstChild.remove();
                updateLineasComercioExterior(data_lineas,min,max);
            }else{
                updateLineasComercioExterior(data_lineas,min,max);
            }
            document.getElementById("titulo_lineas_1").innerHTML = 'Toneladas';
            document.getElementById("titulo_lineas_2").innerHTML = 'Dólares';
        }

    }
}

//Descarga de Datos Comercio Exterior
function loadDataEvolucionComercioExterior(url,apiKey,anio_min,anio_max){
    d3.json(base + url + apiKey + "&filter0=column0[<=]"+anio_max+"&applyFormat=-1", ((error,data) => {
        if(error){
            return console.log(error);
        }else{

            if(data.result.length > 1){
                x = [];
                result = data.result;
                title = result.shift();

                result.map((el)=>{
                    item = {};
                    title.map((label,i)=>{
                        if(label == "AÑO"){
                            item[label] = Number(el[i]);
                        }else{
                            item[label] = el[i];
                        }

                    })
                    x.push(item);
                });
                document.getElementById("titulo_lineas_1").innerHTML = 'Toneladas';
                document.getElementById("titulo_lineas_2").innerHTML = 'Dólares';
                loadChartEvolucionComercioExterior(x,anio_min,anio_max);
            }else{
                if(document.getElementById('lineas_grahp_1').firstChild){ document.getElementById("lineas_grahp_1").firstChild.remove();}
                if(document.getElementById('lineas_grahp_2').firstChild){ document.getElementById("lineas_grahp_2").firstChild.remove();}
                document.getElementById("titulo_lineas_1").innerHTML = 'Toneladas Sin Información';
                document.getElementById("titulo_lineas_2").innerHTML = 'Dólares Sin Información';
            }
        }
    }))
};

//Guerdado de Datos y primera carga de graficos Comercio Exterior
function loadChartEvolucionComercioExterior(x,filtro_min,filtro_max){

    let cross_comercio_exterior = crossfilter(x);

    let Add = ((p, v) => {
        ++p.count;
        p.AÑO = v.AÑO;
        p.TONELADAS += v.TONELADAS;
        p.OPERACIÓN = v.OPERACIÓN;
        if(v.OPERACIÓN == "Exportación") p.exp += v.TONELADAS;
        if(v.OPERACIÓN == "Importación") p.imp += v.TONELADAS
        return p;
    });
    let Remove = ((p, v) => {
        --p.count;
        p.OPERACIÓN = v.OPERACIÓN;
        p.AÑO = v.AÑO;
        p.TONELADAS -= v.TONELADAS;
        return p;
    });
    let Initial = ((p, v) => {
        return {
            AÑO: '',
            OPERACIÓN:'',
            TONELADAS:0,
            exp:0,
            imp:0,
            count:0
        }
    });

    let dim_año_comercio = cross_comercio_exterior.dimension((d)=>{return d.AÑO;}),
        dim_operacion_comercio = cross_comercio_exterior.dimension((d)=>{return d.OPERACIÓN;}),
        group_comercio = dim_año_comercio.group().reduce(Add, Remove, Initial);

    let max = 0;
    for(let i  = 0; i < group_comercio.all().length ; i++){
        if (group_comercio.all()[i].key > group_comercio.all()[max].key ){
            max = i;
            maximo_lineas = group_comercio.all()[i].key;
        }
    }
    //Inicio Donut Toneladas
    loadChartBurbuja4(group_comercio.all()[max].value.exp,group_comercio.all()[max].value.imp,group_comercio.all()[max].key);
    //Fin Donut Toneladas
    let _width_line_1 = $('.lineas_grahp_cl_1').width();
    let _margin_line_1 = {top: 50, right: 10, bottom: 35, left: 60}
    let _rotation_line_1 = 18;
    let _legendX = 0;
    let _height = 280;

    if($(window).width() < 768){
        _rotation_line_1 = 45;
        _margin_line_1 = {top: 50, right: 10, bottom: 55, left: 60};
    }

    let data = {};

    x.map((d)=>{
        if (typeof(data[d.AÑO]) == "undefined"){
            data[d.AÑO] =   {
                                anio:d.AÑO,
                                importacion_total:0,
                                importacion_maritimo:0,
                                exportacion_total:0,
                                exportacion_maritimo:0,

                                importacion_total_dolares:0,
                                importacion_maritimo_dolares:0,
                                exportacion_total_dolares:0,
                                exportacion_maritimo_dolares:0
                            };
        }
        if(d.OPERACIÓN == "Exportación"){
            data[d.AÑO].exportacion_total+=d.TONELADAS;
            data[d.AÑO].exportacion_total_dolares+=d.MILES_DÓLARES_FOB;
            if(d.MODO_TRANSPORTE == "Marítimo"){
                data[d.AÑO].exportacion_maritimo+=d.TONELADAS;
                data[d.AÑO].exportacion_maritimo_dolares+=d.MILES_DÓLARES_FOB;
            }
        }
        if(d.OPERACIÓN == "Importación"){
            data[d.AÑO].importacion_total+=d.TONELADAS;
            data[d.AÑO].importacion_total_dolares+=d.MILES_DÓLARES_FOB;
            if(d.MODO_TRANSPORTE == "Marítimo"){
                data[d.AÑO].importacion_maritimo+=d.TONELADAS;
                data[d.AÑO].importacion_maritimo_dolares+=d.MILES_DÓLARES_FOB;
            }
        }
    });
    data_lineas = data;
    let a = [],b = [],c = [],d = [], e = [],f = [],g = [],h = [], i = [];
    flag = true;
    $.each(data, function(k,v){

        if(flag){
            minimo_lineas = v.anio;
            flag = false;
        }
        if(v.anio <= filtro_max && v.anio >= filtro_min){
            a.push(v.anio);
            b.push(v.importacion_total/1000000);
            c.push(v.importacion_maritimo/1000000);
            d.push(v.exportacion_total/1000000);
            e.push(v.exportacion_maritimo/1000000);

            f.push(v.importacion_total_dolares/1000000);
            g.push(v.importacion_maritimo_dolares/1000000);
            h.push(v.exportacion_total_dolares/1000000);
            i.push(v.exportacion_maritimo_dolares/1000000);
        }
    });


    if(b.length == 0 && c.length == 0 && d.length == 0 && e.length == 0){
        document.getElementById("titulo_lineas_1").innerHTML = 'Toneladas Sin Información';

        if(document.getElementById('lineas_grahp_1').firstChild){ document.getElementById("lineas_grahp_1").firstChild.remove();}
    }else{
        document.getElementById("titulo_lineas_1").innerHTML = 'Toneladas';

        if(document.getElementById('lineas_grahp_1').firstChild){ document.getElementById("lineas_grahp_1").firstChild.remove();}


        ChartLineasToneladas = d3.cloudshapes.lineChartMtt_v2()
                    .width(_width_line_1)
                    .data([b,c,d,e])
                    .labels(a.map((d)=>{
                        return String(d);
                    }))
                    .margin(_margin_line_1)
                    .dataUnit('Millones de Toneladas')
                    .height(_height)
                    .legendX(310)
                    .legendY(10)
                    .showDropShadow(true)
                    .setColor(['#98c9db','#3189b0','#1841FA','#008BFF'])
                    .showYaxis(true)
                    .labelSize(12)
                    .decimalTip(2)
                    .labelRotation(_rotation_line_1)
                    .multiLine(true)
                    .showUnitAxis(false)
                    .colorsCircles(['#3498DB'])

                    .labelTitle(['Importación, Totales', 'Importación, Marítima', 'Exportacion, Totales','Exportacion, Marítima'])
                    ;
        d3.select('#lineas_grahp_1').call(ChartLineasToneladas);

        d3.select('#lineas_grahp_1 svg').append("text")
            .attr("x",-225)
            .attr("y",20)
            .attr("transform","rotate(270)")
            .text("Millones de Toneladas")
            .attr("fill","#232223");

        let legenda_ind = 0;
        let flag = true;
        let legenda = $("#lineas_grahp_1 .mtt-linechart .legend-column").children().each(function(){
            $(this).attr("transform","translate(0,10)");
            if( legenda_ind >= 2 ){
                flag = false;
                legenda_ind = 0;
            }
            if (flag){
                $(this).children().each(function(){
                    if($(this).children().length == 0){
                        $(this).attr("x",140*legenda_ind+40);
                        $(this).attr("y",0);
                    }else{
                        $(this).children().each(function(){
                            $(this).attr("x",140*legenda_ind+40);
                            $(this).attr("y",10);
                        });
                    }
                });
            }else{
                $(this).children().each(function(){
                    if($(this).children().length == 0){
                        $(this).attr("x",140*legenda_ind+40);
                        $(this).attr("y",20);
                    }else{
                        $(this).children().each(function(){
                            $(this).attr("x",140*legenda_ind+40);
                            $(this).attr("y",30);
                        });
                    }
                });
            }
            legenda_ind++;
        });
    }

    if(f.length == 0 && g.length == 0 && h.length == 0 && i.length == 0){
        document.getElementById("titulo_lineas_2").innerHTML = 'Dólares Sin Información';
        if(document.getElementById('lineas_grahp_2').firstChild){ document.getElementById("lineas_grahp_2").firstChild.remove();}
    }else{
        document.getElementById("titulo_lineas_2").innerHTML = 'Dólares';
        if(document.getElementById('lineas_grahp_2').firstChild){ document.getElementById("lineas_grahp_2").firstChild.remove();}

        ChartLineasDolares = d3.cloudshapes.lineChartMtt_v2()
                .width(_width_line_1)
                .data([f,g,h,i])
                .labels(a.map((d)=>{
                    return String(d);
                }))
                .margin(_margin_line_1)
                .dataUnit('Millones de US$')
                .height(_height)
                .legendX(310)
                .legendY(12)

                .showDropShadow(true)
                .setColor(['#98c9db','#3189b0','#1841FA','#008BFF'])
                .showYaxis(true)
                .labelSize(12)
                .decimalTip(2)
                .labelRotation(_rotation_line_1)
                .multiLine(true)
                .showUnitAxis(false)
                .colorsCircles(['#3498DB'])
                .labelTitle(['Importación, Totales', 'Importación, Marítima', 'Exportacion, Totales','Exportacion, Marítima']);

        d3.select('#lineas_grahp_2').call(ChartLineasDolares);


        d3.select('#lineas_grahp_2 svg').append("text")
            .attr("x",-200)
            .attr("y",20)
            .attr("transform","rotate(270)")
            .text("Millones de US$")
            .attr("fill","#232223");

        let legenda_ind = 0;
        let flag = true;
        let legenda = $("#lineas_grahp_2 .mtt-linechart .legend-column").children().each(function(){
            $(this).attr("transform","translate(0,10)");
            if( legenda_ind >= 2 ){
                flag = false;
                legenda_ind = 0;
            }
            if (flag){
                $(this).children().each(function(){
                    if($(this).children().length == 0){
                        $(this).attr("x",140*legenda_ind+40);
                        $(this).attr("y",0);
                    }else{
                        $(this).children().each(function(){
                            $(this).attr("x",140*legenda_ind+40);
                            $(this).attr("y",10);
                        });
                    }
                });
            }else{
                $(this).children().each(function(){
                    if($(this).children().length == 0){
                        $(this).attr("x",140*legenda_ind+40);
                        $(this).attr("y",20);
                    }else{
                        $(this).children().each(function(){
                            $(this).attr("x",140*legenda_ind+40);
                            $(this).attr("y",30);
                        });
                    }
                });
            }
            legenda_ind++;
        });


    }
}

//Update grafico de Comercio Exterior
function updateLineasComercioExterior(data,filtro_min,filtro_max){
    let a = [],b = [],c = [],d = [], e = [],f = [],g = [],h = [], i = [];
    $.each(data, function(k,v){
        if(v.anio <= filtro_max && v.anio >= filtro_min){
            a.push(v.anio)
            b.push(v.importacion_total/1000000);
            c.push(v.importacion_maritimo/1000000);
            d.push(v.exportacion_total/1000000);
            e.push(v.exportacion_maritimo/1000000);

            f.push(v.importacion_total_dolares/1000000);
            g.push(v.importacion_maritimo_dolares/1000000);
            h.push(v.exportacion_total_dolares/1000000);
            i.push(v.exportacion_maritimo_dolares/1000000);
        }
    });

    let _width_line_1 = $('.lineas_grahp_cl_1').width();
    let _margin_line_1 = {top: 50, right: 10, bottom: 35, left: 60};
    let _rotation_line_1 = 18;
    let _legendX = 0;
    let _height = 280;
    if($(window).width() < 768){
        _rotation_line_1 = 45;
        _margin_line_1 = {top: 50, right: 10, bottom: 55, left: 60};
    }

    if(b.length == 0 && c.length == 0 && d.length == 0 && e.length == 0){
        document.getElementById("titulo_lineas_1").innerHTML = 'Toneladas Sin Información';

        if(document.getElementById('lineas_grahp_1').firstChild){ document.getElementById("lineas_grahp_1").firstChild.remove();}
    }else{
        document.getElementById("titulo_lineas_1").innerHTML = 'Toneladas';

        if(document.getElementById('lineas_grahp_1').firstChild){ document.getElementById("lineas_grahp_1").firstChild.remove();}

        var ChartLineasToneladas = d3.cloudshapes.lineChartMtt_v2()
            .width(_width_line_1)
            .data([b,c,d,e])
            .labels(a.map((d)=>{
                return String(d);
            }))
            .margin(_margin_line_1)
            .dataUnit('Millones de Toneladas')
            .height(_height)
            .legendX(310)
            .legendY(10)
            .showDropShadow(true)
            .setColor(['#98c9db','#3189b0','#1841FA','#008BFF'])
            .showYaxis(true)
            .labelSize(12)
            .decimalTip(2)
            .labelRotation(_rotation_line_1)
            .multiLine(true)
            .showUnitAxis(false)
            .colorsCircles(['#3498DB'])
            .labelTitle(['Importación, Totales', 'Importación, Marítima', 'Exportacion, Totales','Exportacion, Marítima'])
            ;
        d3.select('#lineas_grahp_1').call(ChartLineasToneladas);


        d3.select('#lineas_grahp_1 svg').append("text")
            .attr("x",-225)
            .attr("y",20)
            .attr("transform","rotate(270)")
            .text("Millones de Toneladas")
            .attr("fill","#232223");

        let legenda_ind = 0;
        let flag = true;
        let legenda = $("#lineas_grahp_1 .mtt-linechart .legend-column").children().each(function(){
            $(this).attr("transform","translate(0,10)");
            if( legenda_ind >= 2 ){
                flag = false;
                legenda_ind = 0;
            }
            if (flag){
                $(this).children().each(function(){
                    if($(this).children().length == 0){
                        $(this).attr("x",140*legenda_ind+40);
                        $(this).attr("y",0);
                    }else{
                        $(this).children().each(function(){
                            $(this).attr("x",140*legenda_ind+40);
                            $(this).attr("y",10);
                        });
                    }
                });
            }else{
                $(this).children().each(function(){
                    if($(this).children().length == 0){
                        $(this).attr("x",140*legenda_ind+40);
                        $(this).attr("y",20);
                    }else{
                        $(this).children().each(function(){
                            $(this).attr("x",140*legenda_ind+40);
                            $(this).attr("y",30);
                        });
                    }
                });
            }
            legenda_ind++;
        });
    }

    if(f.length == 0 && g.length == 0 && h.length == 0 && i.length == 0){
        document.getElementById("titulo_lineas_2").innerHTML = 'Dólares Sin Información';
        if(document.getElementById('lineas_grahp_2').firstChild){ document.getElementById("lineas_grahp_2").firstChild.remove();}
    }else{
        document.getElementById("titulo_lineas_2").innerHTML = 'Dólares';
        if(document.getElementById('lineas_grahp_2').firstChild){ document.getElementById("lineas_grahp_2").firstChild.remove();}

        var ChartLineasDolares = d3.cloudshapes.lineChartMtt_v2()
            .width(_width_line_1)
            .data([f,g,h,i])
            .labels(a.map((d)=>{
                return String(d);
            }))
            .margin(_margin_line_1)
            .dataUnit('Millones de US$')
            .height(_height)
            .legendX(310)
            .legendY(12)

            .showDropShadow(true)
            .setColor(['#98c9db','#3189b0','#1841FA','#008BFF'])
            .showYaxis(true)
            .labelSize(12)
            .decimalTip(2)
            .labelRotation(_rotation_line_1)
            .multiLine(true)
            .showUnitAxis(false)
            .colorsCircles(['#3498DB'])
            .labelTitle(['Importación, Totales', 'Importación, Marítima', 'Exportacion, Totales','Exportacion, Marítima']);

        d3.select('#lineas_grahp_2').call(ChartLineasDolares);

        d3.select('#lineas_grahp_2 svg').append("text")
            .attr("x",-200)
            .attr("y",20)
            .attr("transform","rotate(270)")
            .text("Millones de US$")
            .attr("fill","#232223");

        let legenda_ind = 0;
        let flag = true;
        let legenda = $("#lineas_grahp_2 .mtt-linechart .legend-column").children().each(function(){
            $(this).attr("transform","translate(0,10)");
            if( legenda_ind >= 2 ){
                flag = false;
                legenda_ind = 0;
            }
            if (flag){
                $(this).children().each(function(){
                    if($(this).children().length == 0){
                        $(this).attr("x",140*legenda_ind+40);
                        $(this).attr("y",0);
                    }else{
                        $(this).children().each(function(){
                            $(this).attr("x",140*legenda_ind+40);
                            $(this).attr("y",10);
                        });
                    }
                });
            }else{
                $(this).children().each(function(){
                    if($(this).children().length == 0){
                        $(this).attr("x",140*legenda_ind+40);
                        $(this).attr("y",20);
                    }else{
                        $(this).children().each(function(){
                            $(this).attr("x",140*legenda_ind+40);
                            $(this).attr("y",30);
                        });
                    }
                });
            }
            legenda_ind++;
        });
    }

}
//Fin Evolucion Comercio Exterior

$(document).ready(() => {
    loadDataAcuerdosComercialesChile(url[1],key);
    loadDataPoblacionChile_Evolucion(url[0],key);
    loadDataGlobalCompetitivenessIndex_tab_1(url[2], key);
    loadDataShipping_Evolucion(url[3],key);
    loadDataLogisticsPerformanceIndex_ev(url[12],key);
    loadDataNumeroProductosExportados(url[17],key);
    loadDataProductosExpImp_d1(url[6],key);
    preDataEvolucionComercioExterior(anio_actual-10,anio_actual);
    loadSociosComercialesExportacion(url[13],key);
    loadSociosComercialesImportacion(url[14],key);
    loadDataGlobalCompetitivenessIndexInfraestructura(url[15],key);

});
