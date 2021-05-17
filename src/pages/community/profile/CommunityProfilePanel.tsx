import React, { useState, useEffect, useCallback } from 'react';
import { CommentRecord, CommunityProfile } from '../type';
import { useDispatch, useSelector } from 'umi';
import ReactMarkdown from 'react-markdown';
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
import moment from 'moment';

const { TextArea } = Input;
interface CommunityProfileTypeProps {
  profile: CommunityProfile | null;
  Comments: CommentRecord[] | null;
  visible: boolean;
  onClose: () => void;
}

const defaultProfile: CommunityProfile = {
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

export function CommunityProfilePanel(props: CommunityProfileTypeProps) {
  const { profile, Comments, onClose } = props;
  const [CurrentTabKey, ChangeCurrentTabKey] = useState('info');
  const [
    CommunityProfile,
    ChangeCommunityProfile,
  ] = useState<CommunityProfile>();
  const [submitting, ChangeSubmitting] = useState(false);
  const [CommentValue, ChangeCommentValue] = useState('');
  const dispatch = useDispatch<any>();
  const [CommentRecord, ChangeCommentRecord] = useState<any[]>([]);

  let communityProfile: CommunityProfile = profile ?? defaultProfile;
  const CommunityId = communityProfile.essayId;

  const ListUserPetsLoading: boolean = useSelector(
    (state: any) => state.loading.effects['info/ListUserPets'],
  );

  const RefreshCommunity = useCallback(() => {
    dispatch({
      type: 'info/GetCommunityProfile',
      payload: {
        essayId: CommunityId,
      },
    }).then((CommunityProfile: CommunityProfile) => {
      if (CommunityProfile instanceof Array) {
        ChangeCommunityProfile(CommunityProfile);
      }
    });
  }, [dispatch, CommunityId]);

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
        essayId: CommunityId,
      },
    });
  };

  useEffect(() => {
    ListComments();
  }, []);

  const DeleteCommunity = () => {
    Modal.confirm({
      title: '您确认删除吗？',
      cancelText: '取消',
      okText: '确定',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'info/RemoveCommunity',
          payload: {
            essayId: CommunityId,
          },
        }).then((success: boolean) => {
          if (success) {
            onClose();
          }
        });
      },
    });
  };

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
          发表评论
        </Button>
      </Form.Item>
    </>
  );
  const imgRecord = JSON.parse(communityProfile?.firstPicture);
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
      <ReactMarkdown
        source={communityProfile?.essayContent}
        escapeHtml={false}
      />
      <RichEditor
        readOnly
        value={communityProfile?.essayContent}
        onChange={HandleChangeEditor}
      />
      {
        // TODO 如果有评论
        <List
          className="comment-list"
          header={`${data?.length}条评论`}
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
