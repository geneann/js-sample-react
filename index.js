import React from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import debug from "debug";
import moment from "moment";
import Table from 'react-table';

import "./styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-table/react-table.css";

import Button from "./components/Button";
import InputEmail from "./components/InputEmail";
import RadioButton from "./components/RadioButton";


let currentDate = new Date();
const log = debug("myapp:App");
class App extends React.Component {
  // d.setMonth(d.getMonth() - 3);
  state = {
    startDate: currentDate,
    endDate: currentDate,
    email: "",
    temp: "",
    reportType: "json",
    data: []
  };


  sort_methods = {};

  constructor(props) {
    super(props);

    for (let value in this.const_cols) {
      const key = value.dataKey;

      this.sort_methods[key] = {
        ASC: (a, b) => (a[key] > b[key] ? 1 : -1),
        DESC: (a, b) => (a[key] < b[key] ? 1 : -1)
      };
    }
  }

  handleStartDateChange = event => {
    log(event)
    this.setState({ startDate: event });
  };

  handleEndDateChange = event => {
    this.setState({ endDate: event });
  };

  handleEmailChange = event => {
    this.setState({ email: event.currentTarget.value });
  };

  handlePrevDayClick = event => {
    const d = new Date(currentDate);
    this.setState({
      endDate: new Date(currentDate),
      startDate: d.setHours(d.getHours() - 24)
    });
  };

  handlePrevWeekClick = event => {
    const d = new Date(currentDate);
    this.setState({
      endDate: new Date(currentDate),
      startDate: d.setHours(d.getHours() - 24 * 7)
    });
  };

  handlePrevMonthClick = event => {
    const d = new Date(currentDate);
    this.setState({
      endDate: new Date(currentDate),
      startDate: d.setHours(d.getHours() - 24 * 30)
    });
  };

  handleGetReportClick = async () => {
    const stDate = moment(new Date(
     this.state.startDate
   )).format('DD-MM-YYYY');
    const enDate = moment(new Date(
     this.state.endDate
   )).format('DD-MM-YYYY');
    if (this.state.reportType === "json") {
      const response = await fetch(
        `/run?startdate=${stDate}&enddate=${enDate}&email=${this.state.email}&formattype=${this.state.reportType}`);

      const json = await response.json();
      this.setState({data: json});





    } else if (this.state.reportType === "csv") {
      const response = await fetch(
        `/run?startdate=${stDate}&enddate=${enDate}&email=${this.state.email}&formattype=${this.state.reportType}`);
        this.setState({data: []});


    }
  };

  render() {
    const columns = this.const_cols;
    return (
      <div className="App">
        <h1>Continuous Delivery Metric Reports</h1>
        <h2>Gitlab Commits Report Generator</h2>
        <div>
          <label>
            Start Date:
            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleStartDateChange}
              dateFormat="dd-MM-yyyy"
            />
          </label>
          <label>
            End Date:
            <DatePicker
              selected={this.state.endDate}
              onChange={this.handleEndDateChange}
              dateFormat="dd-MM-yyyy"
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <InputEmail
              isDisabled={() => this.state.reportType === "json"}
              getValue={() => this.state.email}
              onChange={this.handleEmailChange}
            />
          </label>
        </div>
        <div>
          <RadioButton
            getValue={() => this.state.reportType}
            onChange={event => {
              this.setState({ reportType: event.currentTarget.value });
            }}
          />
        </div>
        <div>
          <Button
            name="Previous Day"
            onClick={this.handlePrevDayClick}
            value="prev day"
          />
          <Button
            name="Previous Week"
            onClick={this.handlePrevWeekClick}
            value="prev week"
          />
          <Button
            name="Previous Month"
            onClick={this.handlePrevMonthClick}
            value="prev month"
          />
        </div>
        <div>
          <Button name="Get Report" onClick={this.handleGetReportClick} />
        </div>
        <>
          <Table
              data={this.state.data}
              columns={[
                {
                  Header: "Name",
                  accessor: "name"
                },
                {
                  Header: "Email",
                  accessor: "email"
                },
                {
                  Header: "Employee ID",
                  accessor: "employeeId"
                },
              ]}
          />
          </>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
