export class Order {
  id: number;
  ticketAmount: number;
  totalPrice: number;

  //routes
  departureTime: string;
  arrivalTime: string;
  ticketsLeft: number;

  //Arrival terminal
  arrivalTerminalName: string;
  arrivalTerminalCity: string;
  arrivalTerminalZipCode: string;
  arrivalTerminalStreet: string;

  //departure terminal
  departureTerminalName: string;
  departureTerminalCity: string;
  departureTerminalZipCode: string;
  departureTerminalStreet: string;

  //boat
  boatName: string;
  capacity: number;
  ticketPrice: number;

  //customer
  firstname: string;
  lastname: string;
  street: string;
  phonenr: string;
  email: string;
  zipCode: string;
  city: string;

}
