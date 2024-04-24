'use strict'
const { Types } = require('mongoose')
const { findFarmByEmail, getFarm, updateFarm, getAllFarms } = require('../models/repositories/farm.repo')

class FarmService {

  static async getAllFarms() {
    const farms = await getAllFarms()
    if (!farms || farms.length === 0) {
      return []
    }
    // map farms and get email from user has the same _id with farm and return new array
    const farmWithUser = await Promise.all(
      farms.map(async (farm) => {
        const user = await getUser({ userId: farm._id.toString() })
        return {
          _id: farm._id,
          name: farm.name,
          description: farm.description,
          status: farm.status,
          district: farm.district,
          address: farm.address,
          createdAt: farm.createdAt,
          email: user.email,
          roles: user.roles[0],
          walletAddress: farm.walletAddress
        }
      })
    )

    const allFarms = farmWithUser.filter((farm) => farm.roles === 'FARM')

    return allFarms
  }

  static async updateStatusFarm({ farmId, status }) {
    if (!farmId) {
      throw new BadRequestError('Farm ID is required')
    }
    if (!isValidObjectId(farmId)) {
      throw new BadRequestError('Farm ID is invalid')
    }
    if (!status) {
      throw new BadRequestError('Status is required')
    }
    if (status !== 'active' && status !== 'inactive') {
      throw new BadRequestError('Status is invalid')
    }

    console.log('farmId', farmId)
    console.log('status', status)
    const updatedFarm = await updateFarm({ farmId, farmInfo: { status } })


    return updatedFarm
  }
}

module.exports = FarmService
