import Taro, { Component } from '@tarojs/taro'
import {View, Picker, Image} from "@tarojs/components";
import api from '../../api/address/address'
import right from "../../imgs/icons/right.png";
import './index.styl'

export default class CityPicker extends Component{
  constructor(props){
    super(props)
    this.state = {
      province:[],
      city:[],
      country:[],
      selector:[[],[],[]],
      selectProvinceIndex:0,
      selectCityIndex:0,
      selectContryIndex:0,
      value:[0,0,0],
      resultText:''
    }
  }
  componentWillMount() {
    this.init()
  }
  async init(){
    await this.setProvince()
    await this.setCityList()
    await this.setCountry()
    this.getResult('first')
  }
  getResult(type) {
    const {province, city, country, selectProvinceIndex, selectCityIndex, selectContryIndex} = this.state
    let result = {
      selectProvince:province[selectProvinceIndex].id,
      selectCity:city[selectCityIndex].id,
      country:country[selectContryIndex].id,
      type
    }
    this.setState({
      resultText:province[selectProvinceIndex].name+city[selectCityIndex].name+country[selectContryIndex].name
    })
    this.props.onSelectSure(result)
  }
  setProvince(){
    const {selector} = this.state
    return new Promise(resolve => {
      api.findByParent({level:'PROVINCE'}).then(res=>{
        selector.splice(0,1,res.items)
        this.setState({
          province:res.items,
          selector
        },()=>{
          resolve()
        })
      })
    })
  }
  setCityList(provinceIndex = 0){
    const { province,selector,value } = this.state
    const {code} = province[provinceIndex]
    selector.splice(1,1,[])
    value.splice(0,1,provinceIndex)
    this.setState({
      selectProvinceIndex:provinceIndex,
      selector,
      value
    })
    return new Promise(resolve => {
      api.findByParent({level:'CITY',parent:code}).then(res=>{
        selector.splice(1,1,res.items)
        this.setState({
          city:res.items,
          selector
        },()=>{
          resolve()
        })
      })
    })
  }
  setCountry(cityIndex = 0){
    const { city,selector,value} = this.state
    const {code} = city[cityIndex]
    selector.splice(2,1,[])
    value.splice(1,1,cityIndex)
    this.setState({
      selectCityIndex:cityIndex,
      selector
    })
    return new Promise(resolve => {
      api.findByParent({level:'COUNTRY',parent:code}).then(res=>{
        selector.splice(2,1,res.items)
        value.splice(2,1,0)
        this.setState({
          selector,
          country:res.items,
          selectContryIndex:0,
          value
        },()=>{
          resolve()
        })
      })
    })

  }
  onChange = () =>{
    this.getResult('two')
  }
  onColumnchange = e =>{
    const {column,value} = e.detail
    if(column === 0){
      this.setCityList(value).then(()=>{
        this.setCountry()
      })
    }else if(column === 1){
      this.setCountry(value)
    }else {
      this.setState({
        selectContryIndex:value
      })
    }
  }
  render(){
    const {selector,value,resultText} = this.state
    const { showName , address } = this.props
    return (
      <View className='index'>
        <Picker  mode='multiSelector' range={selector} rangeKey='name' value={value} onChange={this.onChange} onColumnchange={this.onColumnchange}>
          <View  className='address-btnSelect'>
            {showName=='select' &&
            <View className='picker'>
              {
                resultText || '请选择地区'
              }
            </View>
            }
            {showName=='add' &&
              <View className='picker picker-style'>请输入地区</View>
            }
            {showName=='edit' &&
              <View className='picker'>{address.provinceName}{address.cityName}{address.countryName}</View>
            }
            <View className='address-img'>
              <Image src={right} className='address-ima' />
            </View>
          </View>
        </Picker>
      </View>

    )
  }
}
