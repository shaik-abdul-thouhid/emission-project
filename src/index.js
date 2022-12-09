const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getLocation } = require("./getLocation.js");
const { getDistance } = require("geolib");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/get-emission', async (req, res) => {
	const { body } = req;

	if (body.vehicle === '' || body.vehicle === null || body.vehicle === undefined) 
		return res.status(400).send({ status: false, message: 'invalid Vehicle type' });

	if (body.vehicle === 'airplane') {
		const checkParam = (
			('from' in body) && body.from &&
			('to' in body) && body.to &&
			('tripType' in body) && 
			( body.tripType === 'oneWay' || body.tripType === "round" ) &&
			('flyingClass' in body) && 
			( body.flyingClass === 'economy' || body.flyingClass === "business" || body.flyingClass === 'first') &&
			('noOfPassengers' in body) && 
			typeof body.noOfPassengers === 'number' &&
			body.noOfPassengers > 0
		);

		if (checkParam) {
			const fromLocation = await getLocation(body.from);
			const toLocation = await getLocation(body.to);
			if (fromLocation.response && toLocation.response) {
				const distance = getDistance(fromLocation.location, toLocation.location) / 1000;
				return res.send({ 
					status: 200,
					calculatedEmission: +((distance * body.noOfPassengers * 0.18362) / 1000).toFixed(4)
				});
			}
			else {
				return res.status(400).send({ status: false, message: 'Invalid location names' });
			}
		}
		else 
			return res.status(400).json({
				status: false,
				message: 'Invalid or missing parameters for plane-type'
			});
	}
	else if (body.vehicle === "car") { 
		const checkParam = (
			('from' in body) && body.from &&
			('to' in body) && body.to &&
			('carType' in body) && 
			(body.carType === 'mini' || body.carType === "superMini" || body.carType === 'luxury' || body.carType === 'sports') &&
			('fuelType' in body) && 
			(body.fuelType === 'petrol' || body.fuelType === 'diesel')
		);
		if (checkParam) {
			const fromLocation = await getLocation(body.from);
			const toLocation = await getLocation(body.to);
			if (fromLocation.response && toLocation.response) {
				const distance = getDistance(fromLocation.location, toLocation.location);
				return res.send({ 
					status: 200,
					calculatedEmission: +(distance * body.noOfPassengers * 0.18362).toFixed(4)
				});
			}
			else
			return res.status(400).json({
				status: false, 
				message: 'Invalid location names'
			});
			
		}
		else
			return res.status(400).json({
				status: false,
				message: 'Invalid or missing parameters for car-type'
			});
	}
	else if (body.vehicle === "two") { return res.send() }
	else if (body.vehicle === "bus") { return res.send() }
	else {
		return res.status(400).json({
			status: false,
			message: 'Invalid Vehicle parameter'
		});
	}
});

app.listen(3000, () => {});