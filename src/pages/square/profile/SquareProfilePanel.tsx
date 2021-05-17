import React, { useState, useEffect, useCallback } from 'react';
import { SquareProfile } from '../type';
import { useDispatch, useSelector } from 'umi';
import RichEditor from 'rich-markdown-editor';
import {
  Modal,
  Button,
  Comment,
  Tooltip,
  List,
  Avatar,
  Form,
  Input,
  Carousel,
  Image,
} from 'antd';
import { CommentRecord } from '@/pages/community/type.d';
import ReactMarkdown from 'react-markdown';
const { TextArea } = Input;
interface SquareProfileTypeProps {
  profile: SquareProfile | null;
  Comments: CommentRecord[] | null;
  visible: boolean;
  onClose: () => void;
}

const defaultProfile: SquareProfile = {
  essayId: '',
  userId: '',
  title: '',
  nickname: '',
  createTime: '',
  essayType: '',
  essayContent: '',
  firstPicture: '',
  essayRange: '',
};

export function SquareProfilePanel(props: SquareProfileTypeProps) {
  const { profile, Comments, onClose } = props;
  const [submitting, ChangeSubmitting] = useState(false);
  const [CommentValue, ChangeCommentValue] = useState('');
  const dispatch = useDispatch<any>();
  const [CommentRecord, ChangeCommentRecord] = useState<any[]>([]);
  let squareProfile: SquareProfile = profile ?? defaultProfile;
  const SquareId = squareProfile.essayId;

  const RefreshSquareMoment = useCallback(() => {
    dispatch({
      type: 'square/GetSquareProfile',
      payload: {
        essayId: SquareId,
      },
    }).then((SquareProfile: SquareProfile) => {
      if (SquareProfile instanceof Array) {
        // squareProfile = SquareProfile
      }
    });
  }, [dispatch, SquareId]);

  const HandleChangeEditor = () => {};

  const handleSubmit = () => {
    if (CommentValue) {
      return;
    }
    ChangeSubmitting(true);
    dispatch({
      type: 'community/PublishComment',
      payload: {
        // TODO 评论字段
      },
    }).then((res: boolean) => {
      if (res) {
        ChangeSubmitting(false);
        ChangeCommentValue('');
      }
    });
  };

  const handleCommentChange = (value: string) => {
    ChangeCommentValue(value);
  };

  const ListComments = () => {
    dispatch({
      type: 'square/ListComments',
      payload: {
        essayId: SquareId,
      },
    });
  };

  useEffect(() => {
    ListComments();
  }, []);

  const data =
    Comments &&
    Comments.map((item: CommentRecord) => {
      return {
        // TODO item
        actions: [<span key="comment-list-reply-to-0">Reply to</span>],
        author: 'Han Solo',
        avatar:
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
          <p>
            We supply a series of design principles, practical patterns and high
            quality design resources (Sketch and Axure), to help people create
            their product prototypes beautifully and efficiently.
          </p>
        ),
        datetime: (
          <Tooltip title={'2020-03-21'}>
            <span>{new Date()}</span>
          </Tooltip>
        ),
      };
    });
  const DeleteSquare = () => {
    Modal.confirm({
      title: '您确认删除吗？',
      cancelText: '取消',
      okText: '确定',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'square/RemoveSquare',
          payload: {
            essayId: SquareId,
          },
        }).then((success: boolean) => {
          if (success) {
            onClose();
          }
        });
      },
    });
  };

  const Editor = ({ onChange, onSubmit, submitting, value }: any) => (
    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          loading={submitting}
          onClick={onSubmit}
          type="primary"
        >
          Add Comment
        </Button>
      </Form.Item>
    </>
  );
  const imgRecord = JSON.parse(squareProfile?.firstPicture);
  const contentStyle: any = {
    height: '400px',
    color: '#fff',
    lineHeight: '400px',
    textAlign: 'center',
    margin: '0 auto',
  };
  return (
    <>
      <Carousel autoplay dotPosition="left">
        {imgRecord &&
          imgRecord.map((record: any) => {
            return (
              <>
                <div style={contentStyle}>
                  <Image
                    placeholder={true}
                    height={400}
                    src={`http://119.3.249.45:7070/file/image/${record}`}
                  />
                </div>
              </>
            );
          })}
      </Carousel>
      <ReactMarkdown source={squareProfile?.essayContent} escapeHtml={false} />
      <RichEditor
        readOnly
        value={squareProfile?.essayContent}
        onChange={HandleChangeEditor}
      />
      {
        // TODO 如果有评论
        <List
          className="comment-list"
          header={`${data?.length} replies`}
          itemLayout="horizontal"
          dataSource={data ?? []}
          renderItem={(item) => (
            <li>
              <Comment
                actions={item.actions}
                author={item.author}
                avatar={item.avatar}
                content={item.content}
                datetime={item.datetime}
              />
            </li>
          )}
        />
      }
      <Comment
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
          />
        }
        content={
          <Editor
            onChange={handleCommentChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={CommentValue}
          />
        }
      />
    </>
  );
}
