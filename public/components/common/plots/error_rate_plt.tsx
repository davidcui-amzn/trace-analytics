/*
 *   Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import { EuiHorizontalRule, EuiPanel } from '@elastic/eui';
import _ from 'lodash';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { fixedIntervalToMilli, fixedIntervalToTickFormat, NoMatchMessage, PanelTitle } from '..';
import { Plt } from './plt';

export function ErrorRatePlt(props: {
  items: { items: Plotly.Data[]; fixedInterval: string };
  setStartTime: Dispatch<SetStateAction<string>>;
  setEndTime: Dispatch<SetStateAction<string>>;
}) {
  const getLayout = () =>
    ({
      height: 217,
      margin: {
        l: 57,
        r: 5,
        b: 50,
        t: 30,
        pad: 4,
      },
      annotations: props.items.items.length > 0 && [
        {
          x: props.items.items[0]?.x[props.items.items[0]?.x.length - 1],
          y: 0,
          showarrow: true,
          arrowhead: 0,
          xref: 'x',
          yref: 'y',
          text: `Now: ${props.items.items[0]?.y[props.items.items[0]?.y.length - 1]}%`,
          ax: 0,
          ay: -160,
          borderpad: 10,
          arrowwidth: 0.7,
        },
      ],
      showlegend: false,
      xaxis: {
        fixedrange: true,
        showgrid: false,
        visible: true,
        type: 'date',
        tickformat: fixedIntervalToTickFormat(props.items.fixedInterval),
        color: '#899195',
      },
      yaxis: {
        title: {
          text: 'Error rate (%)',
          font: {
            size: 12,
          },
          standoff: 10,
        },
        range: [
          0,
          Math.min(100, Math.max(...(props.items.items[0]?.y.map((y) => y * 1.2) || []), 1)),
        ],
        fixedrange: true,
        ticksuffix: '%',
        gridcolor: '#d9d9d9',
        showgrid: true,
        visible: true,
        color: '#899195',
      },
    } as Partial<Plotly.Layout>);

  const layout = useMemo(() => getLayout(), [props.items]);

  const onClick = (event) => {
    if (!event?.points) return;
    const point = event.points[0];
    const start = point.data.x[point.pointNumber];
    const end = start + fixedIntervalToMilli(props.items.fixedInterval);
    props.setStartTime(moment(start).toISOString());
    props.setEndTime(moment(end).toISOString());
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <EuiPanel style={{ minWidth: 433, minHeight: 308 }}>
        <PanelTitle title="Trace error rate over time" />
        <EuiHorizontalRule margin="m" />
        {props.items?.items?.length > 0 ? (
          <Plt data={props.items.items} layout={layout} onClickHandler={onClick} />
        ) : (
          <NoMatchMessage size="s" />
        )}
      </EuiPanel>
    </>
  );
}
