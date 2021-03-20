const axios = require('axios');
const cheerio = require('cheerio');
const S = require('string');

const pagina = process.argv.slice(2)

const dados = []

const detalhesnome = []
const detalhesvalor = []

const detalhesnome2 = []
const detalhesvalor2 = []

const localizacaonome = []
const localizacaovalor = []

let categoria = '' //Categoria
let tipo = '' //Tipo

let condominio = '' //Condomínio
let iptu = '' //IPTU
let areautil = '' //Área útil
let quartos = '' //Quartos
let banheiros = '' //Banheiros
let vagas = '' //Vagas na garagem
let detalhesimovel = '' //Detalhes do imóvel
let detalhescondominio = '' //Detalhes do condominio

let cep = ''//CEP
let municipio = ''//Município
let bairro = ''//Bairro
let logradouro = ''//Logradouro


const sitealvo = 'https://pe.olx.com.br/grande-recife/recife/imoveis/venda?o='+pagina

const dadosbrutos = async () =>{
    try {
        const res = await axios.get(sitealvo)        
        return res.data
    } catch (error) {
        console.log('Deu erro ao extrair os DADOS BRUTOS!' + error);
    }
}

const listalinks = async () =>{
    const html = await dadosbrutos();
    const $ = await cheerio.load(html);
    $('.sc-1fcmfeb-2').contents().each(function(i, lnk){
        dados[i] = $(lnk).attr('href');
        });
    return dados
}

const coletadados = async (pg) =>{
    try {
        let documento = []
        const res = await axios.get(pg);
        const html =res.data
        const $ = await cheerio.load(html);

        //CABEÇALHO DO IMÓVEL
        
        let titulo = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.chzacc > h1').text()
        //console.log('Título: ' + titulo);
        let publicacao = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.eQxFPs > div.h3us20-2.bdQAUC > div > span.sc-1oq8jzc-0.jvuXUB.sc-ifAKCX.fizSrB').text()
        let valorreal = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.dPdcQP > div > div > div.sc-hmzhuo.sc-1wimjbb-2.dghGmZ.sc-jTzLTM.iwtnNi > div > h2').text()
        //console.log('Valor: ' + valorreal);
        let datapublicacao = publicacao.substring(13, 18).concat('/').concat('2021')
        //console.log('Data: ' + datapublicacao);
        let horapublicacao = publicacao.substring(22, 27)
        //console.log('Hora: ' + horapublicacao);
        let codigo = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.eQxFPs > div.h3us20-2.bdQAUC > div > span.sc-16iz3i7-0.qJvUT.sc-ifAKCX.fizSrB').text()
        //console.log('Codigo: ' + codigo);

        //CATEGORIA E TIPO
        for (let i = 1; i < 3; i++) {
            
            detalhesnome[i] = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.gbTsIp > div > div.sc-bwzfXH.h3us20-0.cBfPri > div:nth-child('+ i +') > div > dt').text();                        
            detalhesvalor[i] = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.gbTsIp > div > div.sc-bwzfXH.h3us20-0.cBfPri > div:nth-child(' + i + ') > div > a').text();
            
            //console.log(detalhesnome[i]+': '+detalhesvalor[i]);

            if(detalhesnome[i] === 'Categoria'){
                categoria = detalhesvalor[i];
                //console.log('Categoria: ' + categoria)
            }

            if(detalhesnome[i] === 'Tipo'){
                tipo = detalhesvalor[i];
                //console.log('Tipo: ' + tipo)
            }
        } 
        
        //DADOS DO IMOVEL
        for (let k = 3; k < 11; k++) {
            detalhesnome2[k] = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.gbTsIp > div > div.sc-bwzfXH.h3us20-0.cBfPri > div:nth-child(' + k + ') > div > dt').text();
            detalhesvalor2[k] = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.gbTsIp > div > div.sc-bwzfXH.h3us20-0.cBfPri > div:nth-child(' + k + ') > div > dd').text();
            
            //console.log(detalhesnome2[k]+': '+detalhesvalor2[k]);

            if(detalhesnome2[k] === 'Condomínio'){
                condominio = detalhesvalor2[k]
                //console.log('Condomínio: ' + condominio)
            }
            
            if(detalhesnome2[k] === 'IPTU'){
                iptu = detalhesvalor2[k]
                //console.log('IPTU: ' + iptu)
            }
            
            if(detalhesnome2[k] === 'Área útil'){
                areautil = detalhesvalor2[k]
                //console.log('Área útil: ' + areautil)
            }
            
            if(detalhesnome2[k] === 'Quartos'){
                for(let x = 3; x < 10; x++){
                    quartos = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.gbTsIp > div > div.sc-bwzfXH.h3us20-0.cBfPri > div:nth-child('+ x +') > div > a').text();
                    if(quartos !== ''){
                        //console.log('Quartos: ' + quartos)
                        break;
                    }
                }               
            }
            
            if(detalhesnome2[k] === 'Banheiros'){
                banheiros = detalhesvalor2[k]
                //console.log('Banheiros: ' + banheiros)
            }
            
            if(detalhesnome2[k] === 'Vagas na garagem'){
                vagas = detalhesvalor2[k]
                //console.log('Vagas na garagem: ' + vagas)
            }
            
            if(detalhesnome2[k] === 'Detalhes do imóvel'){
                detalhesimovel = detalhesvalor2[k]
                //console.log('Detalhes do imóvel: ' + detalhesimovel)
            }
            
            if(detalhesnome2[k] === 'Detalhes do condominio'){
                detalhescondominio = detalhesvalor2[k]
                //console.log('Detalhes do condominio: ' + detalhescondominio)
            }
        }  

        //LOCALIZAÇÃO DO IMÓVEL
        for (let j = 1; j < 5; j++) {
            localizacaonome[j] = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.cBwrop > div > div.sc-hmzhuo.gqoVfS.sc-jTzLTM.iwtnNi > div.sc-bwzfXH.h3us20-0.cBfPri > div:nth-child('+ j +') > div > dt').text()
            localizacaovalor[j] = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.cBwrop > div > div.sc-hmzhuo.gqoVfS.sc-jTzLTM.iwtnNi > div.sc-bwzfXH.h3us20-0.cBfPri > div:nth-child('+ j +' ) > div > dd').text()
            
            if(localizacaonome[j] === 'CEP'){
                cep = localizacaovalor[j]
                //console.log('CEP: ' + cep)
            }

            if(localizacaonome[j] === 'Município'){
                municipio = localizacaovalor[j]
                //console.log('Município: ' + municipio)
            }

            if(localizacaonome[j] === 'Bairro'){
                bairro = localizacaovalor[j]
                //console.log('Bairro: ' + bairro)
            }

            if(localizacaonome[j] === 'Logradouro'){
                logradouro = localizacaovalor[j]
                //console.log('Logradouro: ' + logradouro)
            }
            
        }

        documento = {titulo, valorreal, datapublicacao, horapublicacao, codigo, categoria, tipo, condominio, iptu, areautil, quartos, banheiros, vagas, detalhesimovel, detalhescondominio, cep, municipio, bairro, logradouro, pg} 
        console.log(documento)       
        console.log('############################################################################################');

        //CONEXÃO COM BANCO DE DADOS        
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mw");
            var query = { codigo: documento.codigo };
            dbo.collection("imoveisgranderecifevenda").find(query).toArray(function(err, result) {
                if (err) throw err;
                if (result.length > 0){
                    console.log('Imóvel já cadastrado!')
                }else{
                    dbo.collection("imoveisgranderecifevenda").insertOne(documento, function(err, res) {
                        if (err) throw err;
                        console.log("Cadastro realizado!");
                    });
                }
                db.close();
            });            
        });
                
    } catch (error) {
        console.log('Deu pau na extração de dados: '+error);
    }          
}

const apresentadados = async () => {
    const todoslinks = await listalinks();
    todoslinks.map(function(linksfilhos){
        coletadados(linksfilhos);
    })
};

function RetornaDataHoraAtual(){
    var dNow = new Date();
    var localdate = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear() + ' às ' + dNow.getHours() + ':' + dNow.toTimeString().slice(3, 5);
    return localdate;
}

function estavazio(obj){
    for(const prop in obj){
        if(obj.hasOwnProperty(prop))
        return false
    }
    return true
}

const main = async () => {
    await apresentadados();
    console.log('Rodado em: ' + RetornaDataHoraAtual())
    console.log('Site Alvo: ' + sitealvo)
}

main();