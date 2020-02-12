import { OpType } from '@blink-mind/core';
import { Classes, Position, Tooltip } from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { EventKey, getI18nText, I18nKey, Icon, IconName } from '../../../utils';
import { BaseWidget, InlineBlockSpan, ZIndex } from '../../common';

const log = debug('node:view-port-viewer');

const ViewerRoot = styled(ZIndex)`
  position: absolute;
  font-size: 16px;
  background: white;
  right: 30px;
  bottom: 20px;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
`;

const Item = props => {
  return (
    <Tooltip
      content={props.tooltip}
      position={Position.TOP}
      className={Classes.ICON}
    >
      <div className="bm-btn" onClick={props.onClick} tabIndex={-1}>
        {props.children}
      </div>
    </Tooltip>
  );
};

export class ViewPortViewer extends BaseWidget {
  componentDidMount(): void {
    const props = this.props;
    const { controller } = props;
    controller.run('addZoomFactorChangeEventListener', {
      ...props,
      listener: this.zoomFactorChange
    });
  }

  componentWillUnmount(): void {
    const props = this.props;
    const { controller } = props;
    controller.run('removeZoomFactorChangeEventListener', {
      ...props,
      listener: this.zoomFactorChange
    });
  }

  zoomFactorChange = zoomFactor => {
    log('zoomFactorChange', zoomFactor);
    this.setState({ zoomFactor });
  };

  onClickResetZoom = e => {
    const props = this.props;
    const { controller } = props;
    controller.run('setZoomFactor', {
      ...props,
      zoomFactor: 1
    });
  };

  onClickAddZoom = e => {
    const props = this.props;
    const { controller } = props;
    const zoomFactor = controller.run('getZoomFactor', props);
    controller.run('setZoomFactor', {
      ...props,
      zoomFactor: zoomFactor + 0.1
    });
  };

  onClickMinusZoom = e => {
    const props = this.props;
    const { controller } = props;
    const zoomFactor = controller.run('getZoomFactor', props);
    controller.run('setZoomFactor', {
      ...props,
      zoomFactor: zoomFactor - 0.1
    });
  };

  onClickCollapseAll = e => {
    const props = this.props;
    const { controller } = props;
    controller.run('addEventListener', {
      ...props,
      key: EventKey.CENTER_ROOT_TOPIC,
      listener: this.centerRootTopic,
      once: true
    });
    controller.run('operation', {
      ...props,
      opType: OpType.COLLAPSE_ALL
    });
  };

  onClickExpandAll = e => {
    const props = this.props;
    const { controller } = props;
    controller.run('addEventListener', {
      ...props,
      key: EventKey.CENTER_ROOT_TOPIC,
      listener: this.centerRootTopic,
      once: true
    });
    controller.run('operation', {
      ...props,
      opType: OpType.EXPAND_ALL
    });
  };

  centerRootTopic = () => {
    const { model, controller } = this.props;
    controller.run('moveTopicToCenter', {
      ...this.props,
      topicKey: model.editorRootTopicKey
    });
  };

  render() {
    log('render');
    const props = this.props;
    const { controller, zIndex } = props;
    const zoomFactor = controller.run('getZoomFactor', props);
    return (
      <ViewerRoot zIndex={zIndex}>
        <Item
          onClick={this.onClickCollapseAll}
          tooltip={getI18nText(props, I18nKey.COLLAPSE_ALL)}
        >
          {Icon(IconName.COLLAPSE_ALL)}
        </Item>
        <Item
          onClick={this.onClickExpandAll}
          tooltip={getI18nText(props, I18nKey.EXPAND_ALL)}
        >
          {Icon(IconName.EXPAND_ALL)}
        </Item>
        <Item
          onClick={this.centerRootTopic}
          tooltip={getI18nText(props, I18nKey.CENTER_ROOT_TOPIC)}
        >
          {Icon(IconName.CENTER)}
        </Item>
        <Item
          onClick={this.onClickMinusZoom}
          tooltip={getI18nText(props, I18nKey.ZOOM_IN)}
        >
          {Icon(IconName.MINUS)}
        </Item>
        <Item
          onClick={this.onClickResetZoom}
          tooltip={getI18nText(props, I18nKey.RESET)}
        >
          <span className='iconfont'>{`${getI18nText(props, I18nKey.ZOOM)}:${Math.floor(
            zoomFactor * 100
          )}%`}</span>
        </Item>
        <Item
          onClick={this.onClickAddZoom}
          tooltip={getI18nText(props, I18nKey.ZOOM_OUT)}
        >
          {Icon(IconName.PLUS)}
        </Item>
      </ViewerRoot>
    );
  }
}
