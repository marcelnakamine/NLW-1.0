import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'

import './styles.css'
import logo from '../../assets/logo.svg'

class CreatePoint extends React.Component {
  render() {
    return (
      <div id="page-create-point">
        <header>
          <img src={logo} alt="Ecoleta logo"/>

          <Link to="/">
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <form>
          <h1>Cadastro do <br/> ponto de coleta</h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input type="text" name="name" id="name" />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input type="text" name="whatsapp" id="whatsapp"/>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={{ lat: -23.5575756, lng: -46.635728}} zoom={17.5}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={{ lat: -23.5575756, lng: -46.635728}} />
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select name="uf" id="uf">
                  <option value="0">Selecione uma UF</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select name="city" id="city">
                  <option value="0">Selecione uma cidade</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Itens de coleta</h2>
              <span>Slecione um ou mais itens de coleta</span>
            </legend>

            <ul className="items-grid">
              <li>
                <img src="http://localhost:3000/uploads/oleo.svg" alt="ícone óleo"/>
                <span>Óleo de Cozinha</span>
              </li>
              <li>
                <img src="http://localhost:3000/uploads/oleo.svg" alt="ícone óleo"/>
                <span>Óleo de Cozinha</span>
              </li>
              <li>
                <img src="http://localhost:3000/uploads/oleo.svg" alt="ícone óleo"/>
                <span>Óleo de Cozinha</span>
              </li>
              <li>
                <img src="http://localhost:3000/uploads/oleo.svg" alt="ícone óleo"/>
                <span>Óleo de Cozinha</span>
              </li>
              <li>
                <img src="http://localhost:3000/uploads/oleo.svg" alt="ícone óleo"/>
                <span>Óleo de Cozinha</span>
              </li>
              <li>
                <img src="http://localhost:3000/uploads/oleo.svg" alt="ícone óleo"/>
                <span>Óleo de Cozinha</span>
              </li>
            </ul>
          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </div>
    )
  }
}

export default CreatePoint
