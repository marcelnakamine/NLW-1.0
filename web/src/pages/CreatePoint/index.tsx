import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { LeafletMouseEvent } from 'leaflet'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'
import api from '../../services/api'

import './styles.css'
import logo from '../../assets/logo.svg'

interface Item {
  id: number
  title: string
  image_url: string
}

interface UF {
  code: number
  initial: string
}

interface City {
  code: number
  name: string
}

interface IBGEUfResponse {
  id: number
  sigla: string
}

interface IBGECityResponse {
  id: number
  nome: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<UF[]>([])
  const [cities, setCities] = useState<City[]>([])

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })
  const [selectedUf, setSelectedUf] = useState(0)
  const [selectedCity, setSelectedCity] = useState(0)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const history = useHistory()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords

      setInitialPosition([latitude || -23.5575756, longitude || -46.635728])
    })
  }, [])

  useEffect(() => {
    api.get('items').then(res => {
      setItems(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(res => {
      const ufInitials = res.data.map<UF>(uf => ({
        code: uf.id,
        initial: uf.sigla,
      }))
      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(res => {
      const cityInitials = res.data.map<City>(city => ({
        code: city.id,
        name: city.nome
      }))
      setCities(cityInitials)
    })
  }, [selectedUf])

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng,
    ])
  }

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = Number(event.target.value)
    setSelectedUf(uf)
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = Number(event.target.value)
    setSelectedCity(city)
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if(alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([ ...selectedItems, id ])
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { name, email, whatsapp } = formData
    const uf = selectedUf
    const city = selectedCity
    const [ latitude, longitude ] = selectedPosition
    const items = selectedItems

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    }

    await api.post('points', data)

    alert('Ponto de coleta cadastrado! Muito obrigado em colaborar')

    history.push('/')
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta logo"/>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input onChange={handleInputChange} type="text" name="name" id="name" />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input onChange={handleInputChange} type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input onChange={handleInputChange} type="text" name="whatsapp" id="whatsapp"/>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={17.5} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select onChange={handleSelectedUf} value={selectedUf} name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf.code} value={uf.code}>{uf.initial}</option>
                ))}
              </select>
            </div>
             
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select onChange={handleSelectedCity} value={selectedCity} name="city" id="city">
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city.code} value={city.code}>{city.name}</option>
                ))}
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
            {items.map((item: Item) => (
              <li 
                onClick={() => handleSelectItem(item.id)}
                key={item.id}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint
