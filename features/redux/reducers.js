import userData from './userSlice'
import categorieData from './categorySlice'
import { combineReducers } from '@reduxjs/toolkit'

export default combineReducers({userData, categorieData})