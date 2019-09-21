import React from 'react';
import "./workorderview.css";
import moment from 'moment';

class WorkOrderView extends React.Component {



render () {
    return (
        <div className="managementworkordercontainer">
        {this.props.workOrders.map((workOrder, index) => (
         <div className = "managementindividualWorkOrder" key={index}>
           <div className ="managementwodate">Date Submitted: {moment(workOrder.created_at).format("lll")}</div>
            <div className="managementinformationcontainer">
              <div className="managementunitandname">
                <p className="managementunitNumber"> {workOrder.unit_number}</p>
                <p className="managementtenantName"> {workOrder.tenant_name}</p>
              </div>
              <p className="managementissue"> {workOrder.issue}</p>
              <div className="managementwonavbar">
                <button
                  className="managementwonavbarbutton"
                  onClick={() => {
                    this.props.history.push(
                      `/managementportal/modify_work_order/${workOrder.id}`
                    );
                  }}
                >
                  Modify
                </button>

                <button
                  className="managementwonavbarbutton"
                  onClick={() => {
                    this.props.history.push(
                      `/managementportal/complete_work_order/${workOrder.id}`
                    );
                  }}
                >
                  Complete
                </button>

                <button
                  className="managementwonavbarbutton"
                  onClick={() => {
                    this.props.delete(workOrder.id);
                  }}
                >
                  Delete
                </button>
              </div>
              </div>
              
          </div>
        ))}
      </div>


    )

}

}

export default WorkOrderView;