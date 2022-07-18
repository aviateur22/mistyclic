const CityHelper = require('../helpers/controllerHelper/city');


module.exports = {

    /**
     * récupration ville par nom
     * @param {Request} req 
     * @param {Response} res 
     * @param {Object} next 
     */
    getCityByName: async(req, res, next)=>{
        //partie du nom de la ville
        const name = req.params.cityName.toLowerCase();
        
        //recherche de la ville
        const cityHelper = new CityHelper();
        const cityData = await cityHelper.getCities(name);

        //formate les données
        const cities = cityData.map(city=>{
            const data = {};
            data.id = city.id;
            data.city = city.name + ' - ' + city.code;
            return data;
        });

        res.json(cities);
    }
};