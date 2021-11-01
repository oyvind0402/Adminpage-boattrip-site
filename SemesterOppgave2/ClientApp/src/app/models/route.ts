export class Route {
  id: number;
  departureTime: string;
  arrivalTime: string;
  ticketsLeft: number;

  //boat
  boatName: string;
  capacity: string;
  ticketPrice: string;

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
}
